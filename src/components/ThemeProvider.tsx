import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IrlenOverlay } from "./IrlenOverlay";
import { useTheme } from "next-themes";

export const ThemeProvider = () => {
  const { theme, setTheme } = useTheme();
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme("light")}
          className={`${theme === "light" ? "bg-secondary" : ""} ${buttonClassName}`}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme("dark")}
          className={`${theme === "dark" ? "bg-secondary" : ""} ${buttonClassName}`}
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={buttonClassName}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose a Theme</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setTheme("light")} className="w-full">Light</Button>
              <Button onClick={() => setTheme("dark")} className="w-full">Dark</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <IrlenOverlay />
    </div>
  );
};