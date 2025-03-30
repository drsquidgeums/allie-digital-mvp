
import i18n from '@/i18n/config';
import { changeLanguage } from '@/i18n/config';
import { toast } from "sonner";

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
    const success = await changeLanguage(languageCode);
    if (success) {
      const selectedLanguage = supportedLanguages.find(lang => lang.code === languageCode);
      
      toast("Language Changed", {
        description: `Application language has been changed to ${selectedLanguage?.name || languageCode}`,
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error changing language:', error);
    toast("Error", {
      description: "Failed to change language. Please try again.",
      // Remove the variant property as it's not supported by the Sonner toast API
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
