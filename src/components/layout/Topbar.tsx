import { useTranslation } from 'react-i18next';
import { Search, Bell, Globe, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/src/store/useStore';
import { Button } from '@/src/components/ui/button';

export function Topbar() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'fr' : language === 'fr' ? 'ar' : 'en';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400 rtl:right-2.5 rtl:left-auto" />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-0 rounded-md h-9 pl-9 rtl:pr-9 rtl:pl-3 text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleLanguage} title={t('language')}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('language')}</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} title={t('theme')}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">{t('theme')}</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ms-2">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">JD</span>
        </div>
      </div>
    </header>
  );
}
