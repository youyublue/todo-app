-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  theme_preference text default 'light',
  language_preference text default 'zh-CN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  color text default '#3B82F6',
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, name)
);

-- Create todos table
create type todo_status as enum ('pending', 'in_progress', 'completed');
create type todo_priority as enum ('low', 'medium', 'high');

create table todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  status todo_status default 'pending',
  priority todo_priority default 'medium',
  category_id uuid references categories(id) on delete set null,
  recurring_task_id uuid,
  tags text[],
  due_date timestamp with time zone,
  reminder_time timestamp with time zone,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recurring_tasks table
create type recurrence_frequency as enum ('daily', 'weekly', 'monthly');
create type recurrence_mode as enum ('scheduled', 'after_completion');

create table recurring_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  todo_id uuid references todos(id) on delete cascade not null,
  mode recurrence_mode not null default 'scheduled',
  frequency recurrence_frequency not null,
  interval integer default 1,
  start_date date,
  next_run_at timestamp with time zone,
  reminder_time time,
  end_date timestamp with time zone,
  last_generated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table categories enable row level security;
alter table todos enable row level security;
alter table recurring_tasks enable row level security;

-- Create policies
-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Categories
create policy "Users can view own categories" on categories for select using (auth.uid() = user_id);
create policy "Users can create own categories" on categories for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on categories for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on categories for delete using (auth.uid() = user_id);

-- Todos
create policy "Users can view own todos" on todos for select using (auth.uid() = user_id);
create policy "Users can create own todos" on todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos" on todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos" on todos for delete using (auth.uid() = user_id);

-- Recurring tasks
create policy "Users can view own recurring tasks" on recurring_tasks for select 
  using (auth.uid() = user_id);
create policy "Users can create own recurring tasks" on recurring_tasks for insert 
  with check (auth.uid() = user_id);
create policy "Users can update own recurring tasks" on recurring_tasks for update 
  using (auth.uid() = user_id);
create policy "Users can delete own recurring tasks" on recurring_tasks for delete 
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_todos_updated_at before update on todos
  for each row execute function update_updated_at_column();
