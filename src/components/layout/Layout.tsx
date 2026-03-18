import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '@/src/store/useStore';
import { useTranslation } from 'react-i18next';

export function Layout() {
  const { theme, language } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Handle RTL
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
    
    // Sync i18n with store
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [theme, language, i18n]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
