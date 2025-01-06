import React, { useState } from "react";
import { Bold } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fonts = [
  { value: "inter", name: "Inter" },
  { value: "roboto", name: "Roboto" },
  { value: "open-sans", name: "Open Sans" },
  { value: "lato", name: "Lato" },
  { value: "source-sans-pro", name: "Source Sans Pro" },
];

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  onBoldChange: (isBold: boolean) => void;
}

export const FontSelector = ({ selectedFont, onFontChange, onBoldChange }: FontSelectorProps) => {
  const [isBold, setIsBold] = useState(false);

  const handleBoldToggle = () => {
    setIsBold(!isBold);
    onBoldChange(!isBold);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground dark:text-white">Font</label>
      <div className="flex gap-2 items-start">
        <Select value={selectedFont} onValueChange={onFontChange}>
          <SelectTrigger className="text-foreground bg-background dark:bg-gray-800 dark:text-white dark:border-border">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent className="bg-background dark:bg-gray-800 dark:border-border">
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
          className={`h-10 w-10 dark:border-border dark:text-white ${
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