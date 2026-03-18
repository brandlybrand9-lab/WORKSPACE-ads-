import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Plus, MoreHorizontal, Calendar, Trash2, Edit } from 'lucide-react';
import { useAppStore, Task } from '@/src/store/useStore';
import { Modal } from '@/src/components/ui/modal';

export function Tasks() {
  const { t } = useTranslation();
  const { tasks, addTask, updateTask, deleteTask, user } = useAppStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  });

  const columns = ['todo', 'inProgress', 'review', 'done'];
  const isAdmin = user?.role === 'admin';

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
  };

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
          {isAdmin && (
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('createTask')}
            </Button>
          )}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-220px)] overflow-hidden">
          {columns.map(col => (
            <div key={col} className="flex flex-col bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t(col)}</h3>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === col).length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 rtl:pl-2 rtl:pr-0">
                {tasks.filter(task => task.status === col).map(task => (
                  <Card key={task.id} className="cursor-pointer hover:border-indigo-500 transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {t(task.priority)}
                        </span>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(task)} className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
                  {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
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
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(task)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <input
                required
                type="text"
                value={formData.assignee}
                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <input
                required
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
