import React from "react";
import { Button } from "@/components/ui/button";
import { Timer, Headphones, Eye, Paintbrush, Focus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ToolbarTools = () => {
  const tools = [
    { icon: Timer, label: "Pomodoro Timer", onClick: () => {} },
    { icon: Headphones, label: "Text to Speech", onClick: () => {} },
    { icon: Eye, label: "Bionic Reader", onClick: () => {} },
    { icon: Paintbrush, label: "Color Tool", onClick: () => {} },
    { icon: Focus, label: "Focus Mode", onClick: () => {} },
  ];

  return (
    <TooltipProvider>
      {tools.map(({ icon: Icon, label, onClick }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={onClick}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
};