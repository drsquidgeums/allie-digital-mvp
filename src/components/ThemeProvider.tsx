import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ThemeProvider = () => {
  const [theme, setTheme] = React.useState("light");
  const [customColors, setCustomColors] = React.useState({
    background: "#F6F6F7",
    text: "#333333",
    button: "#9b87f5",
  });
  const { toast } = useToast();

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--background", "222.2 84% 4.9%"); // Dark grey
      root.style.setProperty("--foreground", "0 0% 100%"); // White text
      root.style.setProperty("--primary", "240 5% 64.9%"); // Lighter grey for buttons
      root.style.setProperty("--primary-foreground", "0 0% 100%"); // White text on buttons
      root.style.setProperty("--secondary", "240 3.7% 15.9%"); // Darker grey for secondary elements
      root.style.setProperty("--secondary-foreground", "0 0% 100%"); // White text on secondary
      setTheme("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--primary", "222.2 47.4% 11.2%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "210 40% 96.1%");
      root.style.setProperty("--secondary-foreground", "222.2 47.4% 11.2%");
      setTheme("light");
    }
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} theme`,
    });
  };

  const handleCustomColors = (colors: typeof customColors) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for consistency with the theme system
    const hexToHSL = (hex: string) => {
      // Remove the # if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply the custom colors as HSL values
    root.style.setProperty("--background", hexToHSL(colors.background));
    root.style.setProperty("--foreground", hexToHSL(colors.text));
    root.style.setProperty("--primary", hexToHSL(colors.button));
    root.style.setProperty("--primary-foreground", "0 0% 100%");
    
    setCustomColors(colors);
    toast({
      title: "Custom theme applied",
      description: "Your custom colors have been applied",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => applyTheme("light")}
        className={theme === "light" ? "bg-secondary" : ""}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => applyTheme("dark")}
        className={theme === "dark" ? "bg-secondary" : ""}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColors.background}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, background: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={customColors.background}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, background: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColors.text}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, text: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={customColors.text}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, text: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColors.button}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, button: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={customColors.button}
                  onChange={(e) =>
                    handleCustomColors({ ...customColors, button: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};