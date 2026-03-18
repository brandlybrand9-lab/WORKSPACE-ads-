import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Plus, Phone, Mail, Building2 } from 'lucide-react';

const mockLeads = [
  { id: 1, name: 'Acme Corp', contact: 'Alice Smith', email: 'alice@acme.com', value: '$12,000', stage: 'Negotiation' },
  { id: 2, name: 'TechStart', contact: 'Bob Jones', email: 'bob@techstart.io', value: '$8,500', stage: 'Proposal' },
  { id: 3, name: 'Global Retail', contact: 'Carol White', email: 'carol@global.com', value: '$24,000', stage: 'Discovery' },
];

export function CRM() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('crm')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your leads and sales pipeline.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {t('addLead')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('activeLeads')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-indigo-500 transition-colors">
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
                  <div className="text-right">
                    <div className="font-bold text-lg">{lead.value}</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{lead.stage}</div>
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
                <span className="font-medium">12 leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Proposal</span>
                <span className="font-medium">8 leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Negotiation</span>
                <span className="font-medium">5 leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-500">Closed Won</span>
                <span className="font-medium">24 leads</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
