import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Briefcase, CheckSquare, TrendingUp, Users } from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('totalRevenue'),
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: TrendingUp,
    },
    {
      title: t('activeLeads'),
      value: '+2350',
      change: '+180.1% from last month',
      icon: Users,
    },
    {
      title: t('tasksDueToday'),
      value: '12',
      change: '+19% from last month',
      icon: CheckSquare,
    },
    {
      title: t('dealsPipeline'),
      value: '5',
      change: '+201 since last hour',
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          {t('welcome')} John Doe ({t('roleAdmin')})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('overview')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center text-zinc-500">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-xs font-medium">U{i}</span>
                  </div>
                  <div className="ml-4 rtl:mr-4 rtl:ml-0 space-y-1">
                    <p className="text-sm font-medium leading-none">User {i}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Completed task "Design Review"
                    </p>
                  </div>
                  <div className="ml-auto rtl:mr-auto rtl:ml-0 font-medium text-xs text-zinc-500">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
