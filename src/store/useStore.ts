import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';
type Language = 'en' | 'fr' | 'ar';
type Role = 'admin' | 'manager' | 'employee';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AppState {
  theme: Theme;
  language: Language;
  user: User | null;
  isAuthenticated: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  login: (user: User) => void;
  logout: () => void;
}

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
      }, // Mock logged in user for preview
      isAuthenticated: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'app-storage',
    }
  )
);
