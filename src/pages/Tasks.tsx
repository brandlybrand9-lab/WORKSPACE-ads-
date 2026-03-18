import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Plus, MoreHorizontal, Calendar, Flag } from 'lucide-react';

const mockTasks = [
  { id: 1, title: 'Design new landing page', status: 'todo', priority: 'high', assignee: 'Sarah', dueDate: '2026-03-20' },
  { id: 2, title: 'Review Q1 marketing campaign', status: 'inProgress', priority: 'medium', assignee: 'John', dueDate: '2026-03-18' },
  { id: 3, title: 'Update client presentation', status: 'review', priority: 'high', assignee: 'Mike', dueDate: '2026-03-19' },
  { id: 4, title: 'Weekly team sync', status: 'done', priority: 'low', assignee: 'All', dueDate: '2026-03-15' },
];

export function Tasks() {
  const { t } = useTranslation();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const columns = ['todo', 'inProgress', 'review', 'done'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('tasks')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your team's tasks and workflow.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md flex">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm ${view === 'kanban' ? 'bg-white dark:bg-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm ${view === 'table' ? 'bg-white dark:bg-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'}`}
            >
              Table
            </button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('createTask')}
          </Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-220px)] overflow-hidden">
          {columns.map(col => (
            <div key={col} className="flex flex-col bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t(col)}</h3>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full">
                  {mockTasks.filter(t => t.status === col).length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 rtl:pl-2 rtl:pr-0">
                {mockTasks.filter(task => task.status === col).map(task => (
                  <Card key={task.id} className="cursor-pointer hover:border-indigo-500 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {t(task.priority)}
                        </span>
                        <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-medium text-sm mb-3">{task.title}</h4>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium text-[10px]">
                          {task.assignee.charAt(0)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Assignee</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map(task => (
                  <tr key={task.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 font-medium">{task.title}</td>
                    <td className="px-6 py-4">{t(task.status)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {t(task.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{task.assignee}</td>
                    <td className="px-6 py-4">{task.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
