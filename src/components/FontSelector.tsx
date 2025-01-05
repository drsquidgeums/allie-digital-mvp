import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector = ({ selectedFont, onFontChange }: FontSelectorProps) => {
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
      <label className="text-sm font-medium">Font</label>
      <Select value={selectedFont} onValueChange={onFontChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};