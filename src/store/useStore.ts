import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';
type Language = 'en' | 'fr' | 'ar';
type Role = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  email: string;
  value: string;
  stage: string;
}

export interface Client {
  id: string;
  name: string;
  projects: number;
  status: string;
  lastActive: string;
}

interface AppState {
  theme: Theme;
  language: Language;
  user: User | null;
  isAuthenticated: boolean;
  tasks: Task[];
  leads: Lead[];
  clients: Client[];
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  login: (user: User) => void;
  logout: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Design new landing page', status: 'todo', priority: 'high', assignee: 'Sarah', dueDate: '2026-03-20' },
  { id: '2', title: 'Review Q1 marketing campaign', status: 'inProgress', priority: 'medium', assignee: 'John', dueDate: '2026-03-18' },
  { id: '3', title: 'Update client presentation', status: 'review', priority: 'high', assignee: 'Mike', dueDate: '2026-03-19' },
  { id: '4', title: 'Weekly team sync', status: 'done', priority: 'low', assignee: 'All', dueDate: '2026-03-15' },
];

const initialLeads: Lead[] = [
  { id: '1', name: 'Acme Corp', contact: 'Alice Smith', email: 'alice@acme.com', value: '$12,000', stage: 'Negotiation' },
  { id: '2', name: 'TechStart', contact: 'Bob Jones', email: 'bob@techstart.io', value: '$8,500', stage: 'Proposal' },
  { id: '3', name: 'Global Retail', contact: 'Carol White', email: 'carol@global.com', value: '$24,000', stage: 'Discovery' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Acme Corp', projects: 3, status: 'Active', lastActive: '2 days ago' },
  { id: '2', name: 'TechStart', projects: 1, status: 'Active', lastActive: '1 week ago' },
  { id: '3', name: 'Global Retail', projects: 5, status: 'Inactive', lastActive: '1 month ago' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      user: {
        id: '1',
        email: 'admin@agency.com',
        name: 'John Doe',
        role: 'admin',
      },
      isAuthenticated: true,
      tasks: initialTasks,
      leads: initialLeads,
      clients: initialClients,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }] })),
      updateTask: (id, updatedTask) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      
      addLead: (lead) => set((state) => ({ leads: [...state.leads, { ...lead, id: Math.random().toString(36).substr(2, 9) }] })),
      updateLead: (id, updatedLead) => set((state) => ({ leads: state.leads.map(l => l.id === id ? { ...l, ...updatedLead } : l) })),
      deleteLead: (id) => set((state) => ({ leads: state.leads.filter(l => l.id !== id) })),
      
      addClient: (client) => set((state) => ({ clients: [...state.clients, { ...client, id: Math.random().toString(36).substr(2, 9) }] })),
      updateClient: (id, updatedClient) => set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c) })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter(c => c.id !== id) })),
    }),
    {
      name: 'app-storage',
    }
  )
);
