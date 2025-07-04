
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonClassName = "h-9 w-9";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${buttonClassName} card-interactive focus-enhanced ${
            theme === 'light' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="dialog-elevated z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md"
      >
        Toggle theme
      </TooltipContent>
    </Tooltip>
  );
};
