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
      // Invert colors for dark mode
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "222.2 84% 4.9%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--popover", "222.2 84% 4.9%");
      root.style.setProperty("--popover-foreground", "210 40% 98%");
      root.style.setProperty("--primary", "210 40% 98%");
      root.style.setProperty("--primary-foreground", "222.2 47.4% 11.2%");
      root.style.setProperty("--secondary", "217.2 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      setTheme("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
      // Reset to light mode colors
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");
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
    setCustomColors(colors);
    const root = document.documentElement;
    root.style.setProperty("--custom-background", colors.background);
    root.style.setProperty("--custom-text", colors.text);
    root.style.setProperty("--custom-button", colors.button);
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
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