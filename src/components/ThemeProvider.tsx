import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/src/store/useStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, language } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
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

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, language, i18n]);

  return <>{children}</>;
}
