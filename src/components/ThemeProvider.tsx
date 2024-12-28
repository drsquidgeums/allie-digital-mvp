import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FontSelector } from "./FontSelector";
import { ColorPicker } from "./ColorPicker";
import { applyThemeColors } from "@/utils/themeUtils";

export const ThemeProvider = () => {
  const [theme, setTheme] = React.useState("light");
  const [customColors, setCustomColors] = React.useState({
    background: "#F6F6F7",
    text: "#333333",
    button: "#9b87f5",
  });
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const { toast } = useToast();

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#1E1E1E";
      root.style.setProperty("--background", "0 0% 12%");
      root.style.setProperty("--foreground", "0 0% 100%");
      root.style.setProperty("--primary", "0 0% 20%");
      root.style.setProperty("--primary-foreground", "0 0% 100%");
      root.style.setProperty("--secondary", "0 0% 15%");
      root.style.setProperty("--secondary-foreground", "0 0% 100%");
      root.style.setProperty("--card", "240 5% 8%");
      root.style.setProperty("--card-foreground", "0 0% 100%");
      root.style.setProperty("--popover", "240 5% 12%");
      root.style.setProperty("--popover-foreground", "0 0% 100%");
      setTheme("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#F6F6F7";
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--primary", "222.2 47.4% 11.2%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "210 40% 96.1%");
      root.style.setProperty("--secondary-foreground", "222.2 47.4% 11.2%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");
      setTheme("light");
    }
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} theme`,
    });
  };

  const handleFontChange = (font: string) => {
    document.documentElement.style.setProperty("--font-family", `"${font}", sans-serif`);
    setSelectedFont(font);
    toast({
      title: "Font updated",
      description: `Changed to ${font} font`,
    });
  };

  const handleCustomColors = (colors: typeof customColors) => {
    setCustomColors(colors);
  };

  const handleSaveChanges = () => {
    applyThemeColors(customColors);
    toast({
      title: "Custom theme applied",
      description: "Your custom colors have been applied to the workspace",
    });
  };

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => applyTheme("light")}
        className={`${theme === "light" ? "bg-secondary" : ""} bg-white/50 backdrop-blur-sm`}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => applyTheme("dark")}
        className={`${theme === "dark" ? "bg-secondary" : ""} bg-white/50 backdrop-blur-sm`}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm">
            <Palette className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customise Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
            <ColorPicker
              label="Background Colour"
              value={customColors.background}
              onChange={(value) => handleCustomColors({ ...customColors, background: value })}
            />
            <ColorPicker
              label="Text Colour"
              value={customColors.text}
              onChange={(value) => handleCustomColors({ ...customColors, text: value })}
            />
            <ColorPicker
              label="Button Colour"
              value={customColors.button}
              onChange={(value) => handleCustomColors({ ...customColors, button: value })}
            />
            <Button onClick={handleSaveChanges} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};