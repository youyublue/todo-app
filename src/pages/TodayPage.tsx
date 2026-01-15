import { isSameDay } from 'date-fns';
import { TodoList } from '../components/todos/TodoList';
import { useProfile } from '../hooks/useProfile';
import { t } from '../lib/i18n';
import type { Todo } from '../types';

export function TodayPage() {
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  const isToday = (todo: Todo) => {
    if (!todo.due_date) return false;
    return isSameDay(new Date(todo.due_date), new Date());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{t(language, 'todayTitle')}</h1>
        <p className="text-muted-foreground">{t(language, 'todaySubtitle')}</p>
      </div>
      <TodoList 
        filter={isToday} 
        emptyMessage={t(language, 'emptyToday')}
        defaultDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}
