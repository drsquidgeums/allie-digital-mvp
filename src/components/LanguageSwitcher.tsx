
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
import { useToast } from '@/hooks/use-toast';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
  ];

  const handleLanguageChange = async (value: string) => {
    try {
      await i18n.changeLanguage(value);
      localStorage.setItem('i18nextLng', value);
      toast({
        title: "Language Changed",
        description: `Application language has been changed to ${languages.find(lang => lang.code === value)?.name}`,
      });
    } catch (error) {
      console.error('Language change failed:', error);
      toast({
        title: "Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    }
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
