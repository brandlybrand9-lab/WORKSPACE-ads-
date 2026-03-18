import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Plus, Phone, Mail, Building2, Edit, Trash2 } from 'lucide-react';
import { useAppStore, Lead } from '@/src/store/useStore';
import { Modal } from '@/src/components/ui/modal';

export function CRM() {
  const { t } = useTranslation();
  const { leads, addLead, updateLead, deleteLead, user } = useAppStore();
  const isAdmin = user?.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    value: '',
    stage: 'Discovery',
  });

  const handleOpenModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        contact: lead.contact,
        email: lead.email,
        value: lead.value,
        stage: lead.stage,
      });
    } else {
      setEditingLead(null);
      setFormData({ name: '', contact: '', email: '', value: '', stage: 'Discovery' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      updateLead(editingLead.id, formData);
    } else {
      addLead(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('crm')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your leads and sales pipeline.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('addLead')}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('activeLeads')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-indigo-500 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{lead.value}</div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{lead.stage}</div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(lead)}>
                          <Edit className="w-4 h-4 text-zinc-400 hover:text-indigo-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)}>
                          <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Discovery</span>
                <span className="font-medium">{leads.filter(l => l.stage === 'Discovery').length} leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Proposal</span>
                <span className="font-medium">{leads.filter(l => l.stage === 'Proposal').length} leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Negotiation</span>
                <span className="font-medium">{leads.filter(l => l.stage === 'Negotiation').length} leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Closed Won</span>
                <span className="font-medium">{leads.filter(l => l.stage === 'Closed Won').length} leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
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
              <label className="text-sm font-medium">Contact Person</label>
              <input
                required
                type="text"
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Value (e.g., $10,000)</label>
              <input
                required
                type="text"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stage</label>
              <select
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
              >
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingLead ? 'Save Changes' : 'Add Lead'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
