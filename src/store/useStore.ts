import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

type Theme = 'dark' | 'light' | 'system';
type Language = 'en' | 'fr' | 'ar';
export type Role = 'admin' | 'manager' | 'employee';

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
  createdAt?: string;
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
  team: User[];
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // Local state updates
  setLeads: (leads: Lead[]) => void;
  
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addTeamMember: (member: Omit<User, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<User>) => void;
  deleteTeamMember: (id: string) => void;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Design new landing page', status: 'todo', priority: 'high', assignee: 'Sarah', dueDate: '2026-03-20' },
  { id: '2', title: 'Review Q1 marketing campaign', status: 'inProgress', priority: 'medium', assignee: 'John', dueDate: '2026-03-18' },
  { id: '3', title: 'Update client presentation', status: 'review', priority: 'high', assignee: 'Mike', dueDate: '2026-03-19' },
  { id: '4', title: 'Weekly team sync', status: 'done', priority: 'low', assignee: 'All', dueDate: '2026-03-15' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Acme Corp', projects: 3, status: 'Active', lastActive: '2 days ago' },
  { id: '2', name: 'TechStart', projects: 1, status: 'Active', lastActive: '1 week ago' },
  { id: '3', name: 'Global Retail', projects: 5, status: 'Inactive', lastActive: '1 month ago' },
];

const initialTeam: User[] = [
  { id: '1', email: 'admin@agency.com', name: 'John Doe', role: 'admin' },
  { id: '2', email: 'sarah@agency.com', name: 'Sarah Smith', role: 'manager' },
  { id: '3', email: 'mike@agency.com', name: 'Mike Johnson', role: 'employee' },
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
      leads: [], // Leads will now be synced from Firebase
      clients: initialClients,
      team: initialTeam,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      setLeads: (leads) => set({ leads }),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }] })),
      updateTask: (id, updatedTask) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      
      addLead: async (lead) => {
        try {
          await addDoc(collection(db, 'leads'), {
            ...lead,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'leads');
        }
      },
      updateLead: async (id, updatedLead) => {
        try {
          await updateDoc(doc(db, 'leads', id), updatedLead);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
        }
      },
      deleteLead: async (id) => {
        try {
          await deleteDoc(doc(db, 'leads', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
        }
      },
      
      addClient: (client) => set((state) => ({ clients: [...state.clients, { ...client, id: Math.random().toString(36).substr(2, 9) }] })),
      updateClient: (id, updatedClient) => set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c) })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter(c => c.id !== id) })),

      addTeamMember: (member) => set((state) => ({ team: [...state.team, { ...member, id: Math.random().toString(36).substr(2, 9) }] })),
      updateTeamMember: (id, updatedMember) => set((state) => ({ team: state.team.map(m => m.id === id ? { ...m, ...updatedMember } : m) })),
      deleteTeamMember: (id) => set((state) => ({ team: state.team.filter(m => m.id !== id) })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        tasks: state.tasks,
        clients: state.clients,
        team: state.team
        // Exclude 'leads' from local storage persistence since it's in Firebase
      }),
    }
  )
);

// Setup Firebase listener for leads
export function setupFirebaseListeners() {
  const unsubscribeLeads = onSnapshot(
    collection(db, 'leads'),
    (snapshot) => {
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      useAppStore.getState().setLeads(leads);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
    }
  );

  return () => {
    unsubscribeLeads();
  };
}
