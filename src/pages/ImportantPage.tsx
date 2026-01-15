import { TodoList } from '../components/todos/TodoList';
import { useProfile } from '../hooks/useProfile';
import { t } from '../lib/i18n';
import type { Todo } from '../types';

export function ImportantPage() {
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  const isImportant = (todo: Todo) => todo.priority === 'high';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">{t(language, 'importantTitle')}</h1>
        <p className="text-muted-foreground">{t(language, 'importantSubtitle')}</p>
      </div>
      <TodoList 
        filter={isImportant} 
        emptyMessage={t(language, 'emptyImportant')}
        defaultPriority="high"
      />
    </div>
  );
}
