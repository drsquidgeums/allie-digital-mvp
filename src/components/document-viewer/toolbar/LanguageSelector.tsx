
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
import { supportedLanguages, switchLanguage } from '@/utils/languageUtils';

export const LanguageSelector = () => {
  const { t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    switchLanguage(value);
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
              <span className="sr-only">{t('common.language', 'Change language')}</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('common.language', 'Change language')}</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[200px] p-0" align="end">
        <div className="grid grid-cols-1 gap-1 p-2">
          {supportedLanguages.map((lang) => (
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
