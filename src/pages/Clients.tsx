import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Plus, Folder, FileText, MoreVertical } from 'lucide-react';

const mockClients = [
  { id: 1, name: 'Acme Corp', projects: 3, status: 'Active', lastActive: '2 days ago' },
  { id: 2, name: 'TechStart', projects: 1, status: 'Active', lastActive: '1 week ago' },
  { id: 3, name: 'Global Retail', projects: 5, status: 'Inactive', lastActive: '1 month ago' },
];

export function Clients() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('clients')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage client profiles and projects.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {t('addClient')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockClients.map(client => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <Button variant="ghost" size="icon" className="-mr-2 -mt-2 rtl:-ml-2 rtl:-mr-0">
                  <MoreVertical className="w-5 h-5" />
                </Button>
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
    </div>
  );
}
