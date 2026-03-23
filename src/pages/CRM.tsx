import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Plus, Phone, Mail, Building2, Edit, Trash2, Zap, ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import { useAppStore, Lead } from '@/src/store/useStore';
import { Modal } from '@/src/components/ui/modal';

const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

export function CRM() {
  const { t } = useTranslation();
  const { leads, addLead, updateLead, deleteLead, addClient, user } = useAppStore();
  const isAdmin = user?.role === 'admin';

  const [view, setView] = useState<'kanban' | 'list'>('kanban');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contact.trim() || !formData.email.trim() || !formData.value.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      if (editingLead) {
        await updateLead(editingLead.id, formData);
        toast.success('Lead updated successfully');
      } else {
        await addLead(formData);
        toast.success('Lead added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save lead');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const advanceStage = async (lead: Lead) => {
    const currentIndex = STAGES.indexOf(lead.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      try {
        await updateLead(lead.id, { stage: nextStage });
        if (nextStage === 'Closed Won') {
          toast.success(`🎉 Deal Closed: ${lead.name}!`);
        } else {
          toast.success(`Lead moved to ${nextStage}`);
        }
      } catch (error) {
        toast.error('Failed to update lead stage');
      }
    }
  };

  const convertToClient = async (lead: Lead) => {
    addClient({
      name: lead.name,
      projects: 1,
      status: 'Active',
      lastActive: 'Just now'
    });
    try {
      await deleteLead(lead.id);
      toast.success(`${lead.name} has been transferred to Clients!`);
    } catch (error) {
      toast.error('Failed to convert lead');
    }
  };

  const simulateIncomingLead = async () => {
    const newLead = {
      name: 'New Web Lead ' + Math.floor(Math.random() * 1000),
      contact: 'Jane Doe',
      email: `jane${Math.floor(Math.random() * 1000)}@example.com`,
      value: '$' + (Math.floor(Math.random() * 40) + 5) + ',000',
      stage: 'Discovery',
    };
    try {
      await addLead(newLead);
      toast.success('⚡ Automation Triggered: New lead received from website!');
    } catch (error) {
      toast.error('Failed to simulate incoming lead');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('crm')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your leads and sales pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md flex mr-2">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm ${view === 'kanban' ? 'bg-white dark:bg-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'}`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm ${view === 'list' ? 'bg-white dark:bg-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'}`}
            >
              List
            </button>
          </div>
          
          {isAdmin && (
            <>
              <Button variant="outline" onClick={simulateIncomingLead} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950">
                <Zap className="w-4 h-4 mr-2" />
                Simulate Webhook
              </Button>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('addLead')}
              </Button>
            </>
          )}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-220px)] overflow-hidden">
          {STAGES.map(stage => (
            <div key={stage} className="flex flex-col bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  {stage === 'Closed Won' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {stage}
                </h3>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full font-medium">
                  {leads.filter(l => l.stage === stage).length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {leads.filter(lead => lead.stage === stage).map(lead => (
                  <Card key={lead.id} className="cursor-pointer hover:border-indigo-500 transition-colors group relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">{lead.name}</div>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(lead)} className="text-zinc-400 hover:text-indigo-600">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(lead.id)} className="text-zinc-400 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mb-3 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{lead.value}</span>
                        {isAdmin && stage !== 'Closed Won' && (
                          <Button size="sm" variant="secondary" className="h-7 text-xs px-2" onClick={() => advanceStage(lead)}>
                            {stage === 'Negotiation' ? 'Close Deal' : 'Next'}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                        {isAdmin && stage === 'Closed Won' && (
                          <Button size="sm" className="h-7 text-xs px-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => convertToClient(lead)}>
                            To Client
                            <UserPlus className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                          {lead.stage === 'Closed Won' && (
                            <Button variant="ghost" size="icon" onClick={() => convertToClient(lead)} title="Convert to Client">
                              <UserPlus className="w-4 h-4 text-green-600 hover:text-green-700" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(lead)}>
                            <Edit className="w-4 h-4 text-zinc-400 hover:text-indigo-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}>
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
      )}

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
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
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
