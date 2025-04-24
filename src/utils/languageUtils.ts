
import i18n from '@/i18n/config';
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Supported languages with their display names
export const supportedLanguages = [
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
];

// Function to switch language throughout the application
export const switchLanguage = async (languageCode: string) => {
  try {
    // First change the language in i18n
    await i18n.changeLanguage(languageCode);
    
    // Update document language attribute and localStorage
    document.documentElement.setAttribute('lang', languageCode);
    localStorage.setItem('i18nextLng', languageCode);
    
    const selectedLanguage = supportedLanguages.find(lang => lang.code === languageCode);
    
    // Show toast notification confirming language change
    toast({
      title: i18n.t('settings.language'),
      description: i18n.t('settings.languageChanged', { defaultValue: 'Application language changed to {{language}}', language: selectedLanguage?.name || languageCode }),
    });
    
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    toast({
      title: i18n.t('common.error', 'Error'),
      description: i18n.t('settings.languageChangeError', 'Failed to change language. Please try again.'),
      variant: "destructive",
    });
    return false;
  }
};

// Get current language name
export const getCurrentLanguageName = () => {
  const currentCode = i18n.language;
  const language = supportedLanguages.find(lang => lang.code === currentCode);
  return language?.name || currentCode;
};

// Get all supported languages
export const getSupportedLanguages = () => supportedLanguages;

// Welcome notification with correct language
export const showWelcomeNotification = () => {
  toast({
    title: i18n.t('common.success'),
    description: i18n.t('common.welcome'),
  });
};
