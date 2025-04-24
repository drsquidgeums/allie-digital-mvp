
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
import { supportedLanguages, switchLanguage } from '@/utils/languageUtils';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = async (value: string) => {
    await switchLanguage(value);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-3 w-3 text-muted-foreground" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-8 text-sm bg-background hover:bg-accent hover:text-accent-foreground dark:border-border">
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent className="dark:bg-workspace-dark dark:border-border">
          {supportedLanguages.map((lang) => (
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
