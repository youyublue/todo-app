import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { RecurringFrequency, RecurringMode, RecurringTask, Todo } from '../types';
import { toast } from 'react-hot-toast';
import { addDays, addMonths, addWeeks } from 'date-fns';

type RecurrenceInput = {
  mode: RecurringMode;
  frequency: RecurringFrequency;
  interval: number;
  startDate?: string | null;
  reminderTime?: string | null;
};

type AddTodoInput = Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_completed' | 'completed_at'> & {
  recurrence?: RecurrenceInput | null;
};

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: AddTodoInput) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
};

const addInterval = (date: Date, frequency: RecurringFrequency, interval: number) => {
  if (frequency === 'weekly') return addWeeks(date, interval);
  if (frequency === 'monthly') return addMonths(date, interval);
  return addDays(date, interval);
};

const advanceToFuture = (date: Date, frequency: RecurringFrequency, interval: number) => {
  let nextDate = new Date(date);
  const now = new Date();
  while (nextDate <= now) {
    nextDate = addInterval(nextDate, frequency, interval);
  }
  return nextDate;
};

const applyReminderTime = (date: Date, reminderTime?: string | null) => {
  if (!reminderTime) return null;
  const [hour, minute] = reminderTime.split(':').map(Number);
  const reminder = new Date(date);
  reminder.setHours(hour ?? 0, minute ?? 0, 0, 0);
  return reminder.toISOString();
};

const getNextScheduledDate = (baseDate: Date, frequency: RecurringFrequency, interval: number, afterDate: Date) => {
  let nextDate = addInterval(baseDate, frequency, interval);
  while (nextDate <= afterDate) {
    nextDate = addInterval(nextDate, frequency, interval);
  }
  return nextDate;
};

export const useTodos = create<TodoState>((set, get) => {
  const createRecurringInstance = async (template: Todo, recurring: RecurringTask, dueDate: Date) => {
    const reminderTime = applyReminderTime(dueDate, recurring.reminder_time);

    const { data, error } = await supabase
      .from('todos')
      .insert({
        title: template.title,
        description: template.description,
        priority: template.priority,
        category_id: template.category_id,
        tags: template.tags,
        due_date: dueDate.toISOString(),
        reminder_time: reminderTime,
        status: 'pending',
        is_completed: false,
        recurring_task_id: recurring.id,
        user_id: template.user_id,
      })
      .select()
      .single();

    if (error) throw error;

    const created = data as Todo;
    set((state) => ({ todos: [created, ...state.todos] }));
    return created;
  };

  const generateScheduledTasks = async (currentTodos: Todo[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: recurringData, error } = await supabase
        .from('recurring_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const recurringTasks = (recurringData ?? []) as RecurringTask[];
      const now = new Date();

      for (const recurring of recurringTasks) {
        if (recurring.mode !== 'scheduled') continue;

        const template = currentTodos.find((todo) => todo.id === recurring.todo_id);
        if (!template) continue;

        let nextRunAt = recurring.next_run_at ? new Date(recurring.next_run_at) : null;

        if (!nextRunAt) {
          const baseDate = recurring.start_date ?? template.due_date;
          nextRunAt = baseDate
            ? addInterval(new Date(baseDate), recurring.frequency, recurring.interval)
            : advanceToFuture(new Date(), recurring.frequency, recurring.interval);
        }

        if (nextRunAt <= now) {
          const alreadyExists = currentTodos.some((todo) => (
            todo.recurring_task_id === recurring.id &&
            todo.due_date &&
            new Date(todo.due_date).getTime() === nextRunAt!.getTime()
          ));

          if (!alreadyExists) {
            await createRecurringInstance(template, recurring, nextRunAt);
          }

          const nextFuture = advanceToFuture(addInterval(nextRunAt, recurring.frequency, recurring.interval), recurring.frequency, recurring.interval);
          await supabase
            .from('recurring_tasks')
            .update({ next_run_at: nextFuture.toISOString(), last_generated_at: new Date().toISOString() })
            .eq('id', recurring.id);
        } else if (!recurring.next_run_at) {
          await supabase
            .from('recurring_tasks')
            .update({ next_run_at: nextRunAt.toISOString() })
            .eq('id', recurring.id);
        }
      }
    } catch (error: any) {
      console.error('Failed to generate recurring tasks:', error);
    }
  };

  const handleAfterCompletion = async (todo: Todo, completedAt: Date) => {
    if (!todo.recurring_task_id) return;

    const { data, error } = await supabase
      .from('recurring_tasks')
      .select('*')
      .eq('id', todo.recurring_task_id)
      .single();

    if (error || !data) return;

    const recurring = data as RecurringTask;
    if (recurring.mode !== 'after_completion') return;

    const baseDate = todo.due_date
      ? new Date(todo.due_date)
      : recurring.start_date
        ? new Date(recurring.start_date)
        : completedAt;

    const nextRunAt = getNextScheduledDate(baseDate, recurring.frequency, recurring.interval, completedAt);

    const alreadyExists = get().todos.some((item) => (
      item.recurring_task_id === recurring.id &&
      item.due_date &&
      new Date(item.due_date).getTime() === nextRunAt.getTime()
    ));

    if (!alreadyExists) {
      await createRecurringInstance(todo, recurring, nextRunAt);
    }

    await supabase
      .from('recurring_tasks')
      .update({ next_run_at: nextRunAt.toISOString(), last_generated_at: new Date().toISOString() })
      .eq('id', recurring.id);
  };

  return {
    todos: [],
    isLoading: false,

    fetchTodos: async () => {
      set({ isLoading: true });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 先尝试简单的查询，不带 JOIN
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const todoList = data as Todo[];
        set({ todos: todoList });
        await generateScheduledTasks(todoList);
      } catch (error: any) {
        console.error('Failed to fetch todos:', error);
        toast.error(error?.message || 'Failed to fetch todos');
      } finally {
        set({ isLoading: false });
      }
    },

    addTodo: async (newTodo) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Remove non-column fields
        const { categories, recurrence, ...todoData } = newTodo;

        if (recurrence?.mode === 'scheduled' && !todoData.due_date && recurrence.startDate) {
          todoData.due_date = new Date(recurrence.startDate).toISOString();
        }

        if (recurrence?.reminderTime && todoData.due_date) {
          todoData.reminder_time = applyReminderTime(new Date(todoData.due_date), recurrence.reminderTime);
        }

        const { data, error } = await supabase
          .from('todos')
          .insert({
            ...todoData,
            user_id: user.id,
            status: 'pending',
            is_completed: false,
          })
          .select()
          .single();

        if (error) throw error;

        let createdTodo = data as Todo;

        if (recurrence) {
          const baseDate = recurrence.startDate ?? createdTodo.due_date;
          const startDateValue = baseDate ? new Date(baseDate).toISOString().split('T')[0] : null;
          const nextRunAt = recurrence.mode === 'scheduled' && baseDate
            ? addInterval(new Date(baseDate), recurrence.frequency, recurrence.interval)
            : recurrence.mode === 'scheduled'
              ? advanceToFuture(new Date(), recurrence.frequency, recurrence.interval)
              : null;

          const { data: recurringData, error: recurringError } = await supabase
            .from('recurring_tasks')
            .insert({
              user_id: user.id,
              todo_id: createdTodo.id,
              mode: recurrence.mode,
              frequency: recurrence.frequency,
              interval: recurrence.interval,
              start_date: startDateValue,
              next_run_at: nextRunAt ? nextRunAt.toISOString() : null,
              reminder_time: recurrence.reminderTime ?? null,
            })
            .select()
            .single();

          if (recurringError) throw recurringError;

          const { error: updateError } = await supabase
            .from('todos')
            .update({ recurring_task_id: recurringData.id })
            .eq('id', createdTodo.id);

          if (updateError) throw updateError;

          createdTodo = { ...createdTodo, recurring_task_id: recurringData.id } as Todo;
        }

        set((state) => ({ todos: [createdTodo, ...state.todos] }));
        toast.success('Task added successfully');
      } catch (error: any) {
        toast.error('Failed to add task');
        console.error(error);
      }
    },

    updateTodo: async (id, updates) => {
      try {
        const { error } = await supabase
          .from('todos')
          .update(updates)
          .eq('id', id);

        if (error) throw error;

        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      } catch (error: any) {
        toast.error('Failed to update task');
        console.error(error);
      }
    },

    toggleComplete: async (id, isCompleted) => {
      try {
        const completedAt = isCompleted ? new Date() : null;
        const updates = {
          is_completed: isCompleted,
          status: isCompleted ? 'completed' : 'pending',
          completed_at: completedAt ? completedAt.toISOString() : null,
        };

        // Optimistic update
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t) as Todo),
        }));

        const { error } = await supabase
          .from('todos')
          .update(updates)
          .eq('id', id);

        if (error) {
          // Revert on error
          const { data } = await supabase.from('todos').select().eq('id', id).single();
          if (data) {
            set((state) => ({
              todos: state.todos.map((t) => (t.id === id ? data as Todo : t)),
            }));
          }
          throw error;
        }

        const currentTodo = get().todos.find((todo) => todo.id === id);
        if (completedAt && currentTodo) {
          await handleAfterCompletion(currentTodo, completedAt);
        }
      } catch (error: any) {
        toast.error('Failed to update status');
        console.error(error);
      }
    },

    deleteTodo: async (id) => {
      try {
        // Optimistic update
        const previousTodos = get().todos;
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        }));

        const { error } = await supabase
          .from('todos')
          .delete()
          .eq('id', id);

        if (error) {
          set({ todos: previousTodos }); // Revert
          throw error;
        }
        toast.success('Task deleted');
      } catch (error: any) {
        toast.error('Failed to delete task');
        console.error(error);
      }
    },
  };
});
