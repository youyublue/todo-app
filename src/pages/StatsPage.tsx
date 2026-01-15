import { TodoStats } from '../components/todos/TodoStats';
import { useProfile } from '../hooks/useProfile';
import { t } from '../lib/i18n';

export function StatsPage() {
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(language, 'statsTitle')}</h1>
        <p className="text-muted-foreground">{t(language, 'statsSubtitle')}</p>
      </div>
      <TodoStats />
    </div>
  );
}
