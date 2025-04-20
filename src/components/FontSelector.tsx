import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontList } from "./font-selector/FontList";
import { BoldToggle } from "./font-selector/BoldToggle";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector = ({ selectedFont, onFontChange }: FontSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Font</label>
      <div className="flex gap-2 items-start">
        <Select value={selectedFont} onValueChange={onFontChange}>
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