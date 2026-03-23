import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { AuthGuard } from './components/layout/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { CRM } from './pages/CRM';
import { Clients } from './pages/Clients';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { ThemeProvider } from './components/ThemeProvider';
import { setupFirebaseListeners } from './store/useStore';
import './i18n/config';

export default function App() {
  useEffect(() => {
    // Initialize Firebase listeners
    const unsubscribe = setupFirebaseListeners();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="crm" element={<CRM />} />
              <Route path="clients" element={<Clients />} />
              <Route path="team" element={<Team />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
