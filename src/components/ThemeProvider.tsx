
import React from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IrlenOverlay } from "./IrlenOverlay";
import { AmbientMusic } from "./AmbientMusic";
import { FontSelector } from "./FontSelector";

export const ThemeProvider = () => {
  const [mounted, setMounted] = React.useState(false);
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const buttonClassName = "h-9 w-9";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    document.documentElement.style.setProperty('--font-family', font);
  };

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${buttonClassName} bg-background hover:bg-accent hover:text-accent-foreground`}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Customise Font
            </TooltipContent>
          </Tooltip>
          <PopoverContent 
            className="w-[200px] p-4 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
            align="end"
          >
            <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
          </PopoverContent>
        </Popover>
        <IrlenOverlay />
        <AmbientMusic />
      </div>
    </TooltipProvider>
  );
};
