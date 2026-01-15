import { isAfter, startOfDay, isSameDay } from 'date-fns';
import { TodoList } from '../components/todos/TodoList';
import { useProfile } from '../hooks/useProfile';
import { t } from '../lib/i18n';
import type { Todo } from '../types';

export function UpcomingPage() {
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  const isUpcoming = (todo: Todo) => {
    if (!todo.due_date) return false;
    // Check if due date is after today (start of tomorrow)
    const today = startOfDay(new Date());
    return isAfter(new Date(todo.due_date), today) && !isSameDay(new Date(todo.due_date), today);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400">{t(language, 'upcomingTitle')}</h1>
        <p className="text-muted-foreground">{t(language, 'upcomingSubtitle')}</p>
      </div>
      <TodoList filter={isUpcoming} emptyMessage={t(language, 'emptyUpcoming')} />
    </div>
  );
}
