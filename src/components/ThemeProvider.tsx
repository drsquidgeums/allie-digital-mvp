
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

export const ThemeProvider = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonClassName = "h-9 w-9";

  // Only show theme UI after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${buttonClassName} ${
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
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
        >
          Toggle theme
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
