import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ThemeProvider = () => {
  const [theme, setTheme] = React.useState("light");
  const [customColors, setCustomColors] = React.useState({
    background: "#F6F6F7",
    text: "#333333",
  });
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

  const handleCustomColors = (colors: typeof customColors) => {
    setCustomColors(colors);
    document.documentElement.style.setProperty("--custom-background", colors.background);
    document.documentElement.style.setProperty("--custom-text", colors.text);
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
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const bgColor = prompt("Enter background color (hex):", customColors.background);
          const textColor = prompt("Enter text color (hex):", customColors.text);
          if (bgColor && textColor) {
            handleCustomColors({ background: bgColor, text: textColor });
          }
        }}
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};