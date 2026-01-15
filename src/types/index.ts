export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  theme_preference: 'light' | 'dark' | 'system';
  language_preference: 'zh-CN' | 'en-US';
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
};

export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  category_id: string | null;
  recurring_task_id: string | null;
  tags: string[];
  due_date: string | null;
  reminder_time: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  category?: Category | null;
};

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly';
export type RecurringMode = 'scheduled' | 'after_completion';

export type RecurringTask = {
  id: string;
  user_id: string;
  todo_id: string;
  mode: RecurringMode;
  frequency: RecurringFrequency;
  interval: number;
  start_date: string | null;
  next_run_at: string | null;
  reminder_time: string | null;
  end_date: string | null;
  last_generated_at: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'categories'>;
        Update: Partial<Omit<Todo, 'id' | 'categories'>>;
      };
      recurring_tasks: {
        Row: RecurringTask;
        Insert: Omit<RecurringTask, 'id' | 'created_at'>;
        Update: Partial<Omit<RecurringTask, 'id'>>;
      };
    };
  };
};
