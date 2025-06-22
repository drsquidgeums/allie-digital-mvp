
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { supportedLanguages, switchLanguage } from '@/utils/languageUtils';
import { SettingsSection } from "./SettingsSection";
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

export const LanguageSettings = React.memo(() => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = async (value: string) => {
    await switchLanguage(value);
  };

  return (
    <SettingsSection title={t('settings.language')}>
      <div className="flex items-center gap-4">
        <Label htmlFor="language-select">{t('settings.selectLanguage')}</Label>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger 
            id="language-select" 
            className="w-[180px] transition-all duration-200 hover:border-accent-foreground/20"
            aria-label={t('settings.selectLanguage')}
          >
            <SelectValue placeholder={t('settings.selectLanguage')} />
          </SelectTrigger>
          <SelectContent className={`${getDarkModeDropdownClasses()} animate-fade-in`}>
            {supportedLanguages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="transition-colors duration-200"
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SettingsSection>
  );
});

LanguageSettings.displayName = 'LanguageSettings';
