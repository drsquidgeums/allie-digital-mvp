
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-GB',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en-GB', 'en-US', 'es', 'de'],
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    react: {
      useSuspense: true
    }
  });

// Function to change the language throughout the application
export const changeLanguage = async (lng: string) => {
  if (lng && i18n.languages.includes(lng)) {
    await i18n.changeLanguage(lng);
    document.documentElement.setAttribute('lang', lng);
    localStorage.setItem('i18nextLng', lng);
    return true;
  }
  return false;
};

export default i18n;
