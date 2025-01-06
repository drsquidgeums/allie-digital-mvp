import React from "react";
import { Button } from "@/components/ui/button";
import { Palette, Moon, Sun, Book, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog/dialog-root";
import { IrlenOverlay } from "./IrlenOverlay";
import { AmbientMusic } from "./AmbientMusic";
import { useTheme } from "next-themes";
import { FontSelector } from "./FontSelector";

export const ThemeProvider = () => {
  const { theme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const buttonClassName = "h-9 w-9";

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    document.documentElement.style.setProperty('--font-family', font);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`${buttonClassName} ${
            theme === 'light' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => handleThemeChange('light')}
          title="Light Mode"
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`${buttonClassName} ${
            theme === 'dark' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => handleThemeChange('dark')}
          title="Dark Mode"
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`${buttonClassName} ${
            theme === 'sepia' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => handleThemeChange('sepia')}
          title="Sepia Mode"
        >
          <Book className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${buttonClassName} bg-background hover:bg-accent hover:text-accent-foreground`}
              title="Customise Font"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Choose a Font</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
          </DialogContent>
        </Dialog>
      </div>
      <IrlenOverlay />
      <AmbientMusic />
    </div>
  );
};