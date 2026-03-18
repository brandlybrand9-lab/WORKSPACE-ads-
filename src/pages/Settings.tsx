import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useAppStore } from '@/src/store/useStore';

export function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useAppStore();

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Update your language and theme preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('language')}</h3>
            <div className="flex gap-3">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'} 
                onClick={() => handleLanguageChange('en')}
              >
                English
              </Button>
              <Button 
                variant={language === 'fr' ? 'default' : 'outline'} 
                onClick={() => handleLanguageChange('fr')}
              >
                Français
              </Button>
              <Button 
                variant={language === 'ar' ? 'default' : 'outline'} 
                onClick={() => handleLanguageChange('ar')}
              >
                العربية
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('theme')}</h3>
            <div className="flex gap-3">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
              >
                {t('light')}
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
              >
                {t('dark')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
