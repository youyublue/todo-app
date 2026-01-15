import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTodos } from '../../hooks/useTodos';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';

export function TodoStats() {
  const { todos } = useTodos();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.is_completed).length;
    const pending = total - completed;
    
    const byPriority = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    };

    return { total, completed, pending, byPriority };
  }, [todos]);

  const pieData = [
    { name: t(language, 'statsCompleted'), value: stats.completed, color: '#22c55e' },
    { name: t(language, 'statsPending'), value: stats.pending, color: '#ef4444' },
  ];

  if (stats.total === 0) {
    return <div className="text-center text-muted-foreground">{t(language, 'statsNoTasks')}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex flex-col space-y-1.5 pb-2">
          <h3 className="font-semibold leading-none tracking-tight">{t(language, 'statsOverview')}</h3>
        </div>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground">{t(language, 'statsTotalTasks')}</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t(language, 'statsCompleted')}</span>
            <span className="font-bold text-green-500">{stats.completed}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t(language, 'statsPending')}</span>
            <span className="font-bold text-red-500">{stats.pending}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex flex-col space-y-1.5 pb-2">
          <h3 className="font-semibold leading-none tracking-tight">{t(language, 'statsPriorityBreakdown')}</h3>
        </div>
        <div className="h-[150px] w-full mt-4">
           {/* Simple bar visualization */}
           <div className="space-y-4">
             {Object.entries(stats.byPriority).map(([priority, count]) => (
               <div key={priority} className="flex items-center gap-2">
                  <div className="w-16 capitalize text-sm">{priority === 'low' ? t(language, 'lowPriority') : priority === 'high' ? t(language, 'highPriority') : t(language, 'mediumPriority')}</div>

                 <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-primary" 
                     style={{ width: `${(count / stats.total) * 100}%` }}
                   />
                 </div>
                 <div className="w-8 text-right text-sm font-bold">{count}</div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 col-span-full md:col-span-1">
        <div className="flex flex-col space-y-1.5 pb-2">
          <h3 className="font-semibold leading-none tracking-tight">{t(language, 'statsStatus')}</h3>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
