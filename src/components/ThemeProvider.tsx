import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette, RotateCcw } from "lucide-react";
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
import { IrlenOverlay } from "./IrlenOverlay";

export const ThemeProvider = () => {
  const [theme, setTheme] = React.useState("light");
  const [previousColors, setPreviousColors] = React.useState({
    background: "#F6F6F7",
    text: "#333333",
    sidebar: "#FFFFFF",
  });
  const [customColors, setCustomColors] = React.useState({
    background: "#F6F6F7",
    text: "#333333",
    sidebar: "#FFFFFF",
  });
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const [tempFont, setTempFont] = React.useState("Inter");
  const { toast } = useToast();

  const defaultLightColors = {
    background: "#F6F6F7",
    text: "#333333",
    sidebar: "#FFFFFF",
  };

  const defaultDarkColors = {
    background: "#1E1E1E",
    text: "#FFFFFF",
    sidebar: "#222222",
  };

  const resetTheme = () => {
    setCustomColors(previousColors);
    setTempFont(selectedFont);
    applyThemeColors(previousColors);
    toast({
      title: "Theme reset",
      description: "Theme has been reset to previous values",
    });
  };

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    const colors = newTheme === "dark" ? defaultDarkColors : defaultLightColors;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setPreviousColors(colors);
    setCustomColors(colors);
    applyThemeColors(colors);
    setTheme(newTheme);
    
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} theme`,
    });
  };

  const handleFontChange = (font: string) => {
    setTempFont(font);
  };

  const handleCustomColors = (colors: typeof customColors) => {
    setCustomColors(colors);
  };

  const handleApplyChanges = () => {
    // Store current values as previous before applying new ones
    setPreviousColors(customColors);
    applyThemeColors(customColors);
    document.documentElement.style.setProperty("--font-family", `"${tempFont}", sans-serif`);
    toast({
      title: "Changes applied",
      description: "Your custom theme has been applied. Click Save Changes to keep these settings.",
    });
  };

  const handleSaveChanges = () => {
    setSelectedFont(tempFont);
    toast({
      title: "Changes saved",
      description: "Your custom theme settings have been saved",
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
            <FontSelector selectedFont={tempFont} onFontChange={handleFontChange} />
            <ColorPicker
              label="Background Color"
              value={customColors.background}
              onChange={(value) => handleCustomColors({ ...customColors, background: value })}
            />
            <ColorPicker
              label="Text Color"
              value={customColors.text}
              onChange={(value) => handleCustomColors({ ...customColors, text: value })}
            />
            <ColorPicker
              label="Sidebar & Dialog Color"
              value={customColors.sidebar}
              onChange={(value) => handleCustomColors({ ...customColors, sidebar: value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleApplyChanges} className="flex-1">
                Apply Changes
              </Button>
              <Button onClick={handleSaveChanges} variant="secondary" className="flex-1">
                Save Changes
              </Button>
              <Button onClick={resetTheme} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <IrlenOverlay />
    </div>
  );
};