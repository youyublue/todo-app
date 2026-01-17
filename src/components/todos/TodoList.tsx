import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { useCategories } from '../../hooks/useCategories';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { Spinner } from '../ui/Spinner';
import type { Todo, TodoPriority } from '../../types';

interface TodoListProps {
  filter?: (todo: Todo) => boolean;
  hideForm?: boolean;
  emptyMessage?: string;
  defaultDate?: string;
  defaultPriority?: TodoPriority;
}

export function TodoList({
  filter,
  hideForm = false,
  emptyMessage,
  defaultDate,
  defaultPriority
}: TodoListProps) {
  const { todos, isLoading, fetchTodos } = useTodos();
  const { fetchCategories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';
  const fallbackEmptyMessage = t(language, 'emptyNoTasksFound');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [fetchTodos, fetchCategories]);

  const filteredTodos = useMemo(() => {
    if (!filter) return todos;
    return todos.filter(filter);
  }, [todos, filter]);

  const activeTodos = useMemo(() => filteredTodos.filter((todo) => !todo.is_completed), [filteredTodos]);
  const completedTodos = useMemo(() => filteredTodos.filter((todo) => todo.is_completed), [filteredTodos]);

  if (isLoading && todos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!hideForm && <TodoForm defaultDate={defaultDate} defaultPriority={defaultPriority} />}
      
      <div className="space-y-3">
        {activeTodos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>{todos.length === 0 ? t(language, 'emptyNoTasksYet') : (emptyMessage ?? fallbackEmptyMessage)}</p>
          </div>
        ) : (
          activeTodos.map((todo, index) => (
            <div
              key={todo.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slideIn"
            >
              <TodoItem todo={todo} />
            </div>
          ))
        )}
      </div>

      {completedTodos.length > 0 && (
        <div className="border-t pt-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowCompleted((prev) => !prev)}
            className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              {showCompleted ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="font-medium">{t(language, 'completedSection')}</span>
              <span className="text-xs text-muted-foreground">({completedTodos.length})</span>
            </span>
          </button>

          {showCompleted && (
            <div className="space-y-3">
              {completedTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className="animate-fadeIn"
                >
                  <TodoItem todo={todo} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
