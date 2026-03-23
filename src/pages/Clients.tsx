import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Plus, Folder, FileText, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAppStore, Client } from '@/src/store/useStore';
import { Modal } from '@/src/components/ui/modal';

export function Clients() {
  const { t } = useTranslation();
  const { clients, addClient, updateClient, deleteClient, user } = useAppStore();
  const isAdmin = user?.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    projects: 0,
    status: 'Active',
    lastActive: 'Just now',
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        projects: client.projects,
        status: client.status,
        lastActive: client.lastActive,
      });
    } else {
      setEditingClient(null);
      setFormData({ name: '', projects: 0, status: 'Active', lastActive: 'Just now' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return;
    }
    
    if (formData.projects < 0) {
      toast.error('Active projects cannot be negative');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
      toast.success('Client updated successfully');
    } else {
      addClient(formData);
      toast.success('Client added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    toast.success('Client deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('clients')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage client profiles and projects.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('addClient')}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map(client => (
          <Card key={client.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 rtl:-ml-2 rtl:-mr-0">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(client)}>
                      <Edit className="w-4 h-4 text-zinc-400 hover:text-indigo-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{client.name}</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {client.status}
                </span>
                <span>•</span>
                <span>Last active {client.lastActive}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mb-1"><Folder className="w-3 h-3" /> Projects</span>
                  <span className="font-semibold">{client.projects} active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Invoices</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">All paid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Projects</label>
              <input
                required
                type="number"
                min="0"
                value={formData.projects}
                onChange={e => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingClient ? 'Save Changes' : 'Add Client'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
