import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontList } from "./font-selector/FontList";
import { BoldToggle } from "./font-selector/BoldToggle";
import { globalFontState } from "@/utils/fontStateManager";
import { useToast } from "@/hooks/use-toast";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector = ({ selectedFont, onFontChange }: FontSelectorProps) => {
  const { toast } = useToast();
  const [currentFont, setCurrentFont] = React.useState(globalFontState.selectedFont);

  React.useEffect(() => {
    const unsubscribe = globalFontState.subscribe((newFont) => {
      setCurrentFont(newFont);
      onFontChange(newFont);
    });
    
    return () => {
      unsubscribe();
    };
  }, [onFontChange]);

  const handleFontChange = (font: string) => {
    globalFontState.setFont(font);
    
    toast({
      title: "Font changed",
      description: `Applied ${font} font across the application`,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Font</label>
      <div className="flex gap-2 items-start">
        <Select value={currentFont} onValueChange={handleFontChange}>
          <SelectTrigger className="text-foreground bg-background">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <FontList className="dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]" />
        </Select>
        <BoldToggle />
      </div>
    </div>
  );
};