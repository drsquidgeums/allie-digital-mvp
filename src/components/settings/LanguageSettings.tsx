
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { supportedLanguages, switchLanguage } from '@/utils/languageUtils';
import { SettingsSection } from "./SettingsSection";
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

export const LanguageSettings = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = async (value: string) => {
    await switchLanguage(value);
  };

  return (
    <SettingsSection title={t('settings.language')}>
      <div className="flex items-center gap-4">
        <Label htmlFor="language-select">{t('settings.selectLanguage')}</Label>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger id="language-select" className="w-[180px]">
            <SelectValue placeholder={t('settings.selectLanguage')} />
          </SelectTrigger>
          <SelectContent className={getDarkModeDropdownClasses()}>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SettingsSection>
  );
};
