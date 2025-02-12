
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export const LanguageSettings = () => {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
  ];

  const handleLanguageChange = async (value: string) => {
    try {
      await i18n.changeLanguage(value);
      localStorage.setItem('i18nextLng', value);
      toast({
        title: t('common.success'),
        description: `Application language has been changed to ${languages.find(lang => lang.code === value)?.name}`,
      });
    } catch (error) {
      console.error('Language change failed:', error);
      toast({
        title: t('common.error'),
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('navigation.settings')}</h3>
      <div className="flex items-center gap-4">
        <Label>{t('common.language', 'Select Language')}</Label>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
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
