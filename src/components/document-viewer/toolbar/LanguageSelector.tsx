import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const LanguageSelector = () => {
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground p-0 border-none">
              <Globe className="h-4 w-4" />
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
      </TooltipTrigger>
      <TooltipContent>
        <p>Change language</p>
      </TooltipContent>
    </Tooltip>
  );
};