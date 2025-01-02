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
import { IrlenOverlay } from "./IrlenOverlay";

export const ThemeProvider = () => {
  const [theme, setTheme] = React.useState("light");
  const [selectedFont, setSelectedFont] = React.useState("Inter");
  const { toast } = useToast();

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      setTheme("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
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

  return (
    <div className="flex gap-2">
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
          </div>
        </DialogContent>
      </Dialog>
      <IrlenOverlay />
    </div>
  );
};