import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette, Book } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IrlenOverlay } from "./IrlenOverlay";
import { useTheme } from "next-themes";
import { FontSelector } from "./FontSelector";

export const ThemeProvider = () => {
  const { theme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground";

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    document.documentElement.style.setProperty('--font-family', font);
  };

  const handleDarkMode = () => {
    setTheme('dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('sepia');
  };

  const handleLightMode = () => {
    setTheme('light');
    document.documentElement.classList.remove('dark', 'sepia');
  };

  const handleSepiaMode = () => {
    setTheme('sepia');
    document.documentElement.classList.add('sepia');
    document.documentElement.classList.remove('dark');
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLightMode}
          className={`${theme === "light" ? "bg-secondary" : ""} ${buttonClassName}`}
          title="Light Mode"
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDarkMode}
          className={`${theme === "dark" ? "bg-secondary" : ""} ${buttonClassName}`}
          title="Dark Mode"
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSepiaMode}
          className={`${theme === "sepia" ? "bg-secondary" : ""} ${buttonClassName}`}
          title="Sepia Mode"
        >
          <Book className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={buttonClassName}
              title="Customise Font"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose a Font</DialogTitle>
            </DialogHeader>
            <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
          </DialogContent>
        </Dialog>
      </div>
      <IrlenOverlay />
    </div>
  );
};