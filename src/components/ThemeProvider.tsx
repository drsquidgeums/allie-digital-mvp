import React from "react";
import { Button } from "@/components/ui/button";
import { Type, Moon, Sun, Book } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  React.useEffect(() => {
    document.documentElement.className = theme || '';
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${buttonClassName} bg-background hover:bg-accent hover:text-accent-foreground`}
            title="Customise Font"
          >
            <Type className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[200px] p-4 dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
          align="end"
        >
          <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
        </PopoverContent>
      </Popover>
      <IrlenOverlay />
      <AmbientMusic />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`${buttonClassName} ${
            theme === 'light' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => setTheme('light')}
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
          onClick={() => setTheme('dark')}
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
          onClick={() => setTheme('sepia')}
          title="Sepia Mode"
        >
          <Book className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};