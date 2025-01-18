import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pl', name: 'Polski' },
    { code: 'sv', name: 'Svenska' }
  ];

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('i18nextLng', value);
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-3 w-3 text-muted-foreground" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-8 text-sm bg-background hover:bg-accent hover:text-accent-foreground dark:border-border">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="dark:bg-workspace-dark dark:border-border">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="dark:focus:bg-accent dark:focus:text-accent-foreground"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};