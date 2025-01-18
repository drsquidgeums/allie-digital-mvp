import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Headphones, Eye, Paintbrush, Focus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ToolbarTools = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const tools = [
    { id: "pomodoro", icon: Timer, label: "Pomodoro Timer", onClick: () => {} },
    { id: "tts", icon: Headphones, label: "Text to Speech", onClick: () => {} },
    { id: "bionic", icon: Eye, label: "Bionic Reader", onClick: () => {} },
    { id: "color", icon: Paintbrush, label: "Color Tool", onClick: () => {} },
    { id: "focus", icon: Focus, label: "Focus Mode", onClick: () => {} },
  ];

  const handleToolClick = (toolId: string) => {
    setActiveToolId(activeToolId === toolId ? null : toolId);
  };

  return (
    <TooltipProvider>
      {tools.map(({ id, icon: Icon, label }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleToolClick(id)}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </Button>
              {activeToolId === id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-fade-in" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
};