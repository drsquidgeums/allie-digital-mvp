import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bold } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog-root";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector = ({ selectedFont, onFontChange }: FontSelectorProps) => {
  const [isBold, setIsBold] = React.useState(false);
  const { toast } = useToast();

  const handleBoldToggle = () => {
    setIsBold(!isBold);
    document.documentElement.style.setProperty('--font-weight', !isBold ? 'bold' : 'normal');
    toast({
      title: !isBold ? "Bold text enabled" : "Bold text disabled",
      description: "Font weight has been updated",
    });
  };

  const fonts = [
    // ADHD-friendly fonts
    { name: "Verdana", value: "Verdana" },
    { name: "Arial", value: "Arial" },
    { name: "Comic Sans MS", value: "Comic Sans MS" },
    { name: "Century Gothic", value: "Century Gothic" },
    { name: "Tahoma", value: "Tahoma" },
    
    // Autism-friendly fonts
    { name: "Helvetica", value: "Helvetica" },
    { name: "Avenir", value: "Avenir" },
    { name: "OpenDyslexic", value: "OpenDyslexic" },
    { name: "Suisse Int'l", value: "Suisse Int'l" },
    
    // Dyslexia-friendly fonts
    { name: "Dyslexie", value: "Dyslexie" },
    { name: "Readability", value: "Readability" },
    { name: "Lexie Readable", value: "Lexie Readable" },
    { name: "Andika", value: "Andika" },
    
    // Additional fonts for various needs
    { name: "Georgia", value: "Georgia" },
    { name: "Trebuchet MS", value: "Trebuchet MS" },
    { name: "Lucida Sans", value: "Lucida Sans" },
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Lato", value: "Lato" },
    { name: "Source Sans Pro", value: "Source Sans Pro" },
    { name: "Segoe UI", value: "Segoe UI" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground dark:text-white">Font</label>
      <div className="flex gap-2 items-start">
        <Select value={selectedFont} onValueChange={onFontChange}>
          <SelectTrigger className="text-foreground bg-background dark:bg-gray-800 dark:text-white dark:border-gray-600">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent className="bg-background dark:bg-gray-800">
            <SelectScrollUpButton className="text-foreground dark:text-white" />
            {fonts.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                className="text-foreground hover:bg-accent hover:text-accent-foreground dark:text-white dark:hover:bg-gray-700"
              >
                {font.name}
              </SelectItem>
            ))}
            <SelectScrollDownButton className="text-foreground dark:text-white" />
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={handleBoldToggle}
          className={`h-10 w-10 dark:border-gray-600 dark:text-white ${
            isBold 
              ? 'bg-accent text-accent-foreground dark:bg-gray-700' 
              : 'text-foreground dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
          title="Toggle bold text"
        >
          <Bold className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};