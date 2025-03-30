
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { supportedLanguages, switchLanguage } from '@/utils/languageUtils';

export const LanguageSettings = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = async (value: string) => {
    await switchLanguage(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.language')}</h3>
      <div className="flex items-center gap-4">
        <Label>{t('common.language', 'Select Language')}</Label>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('settings.selectLanguage', 'Select language')} />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
    </div>
  );
};
