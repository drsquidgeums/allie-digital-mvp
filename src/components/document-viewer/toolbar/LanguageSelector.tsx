import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Change language</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change language</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[200px] p-0" align="end">
        <div className="grid grid-cols-1 gap-1 p-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};