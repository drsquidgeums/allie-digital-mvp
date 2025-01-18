import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Headphones, Eye, Paintbrush, Focus, Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PomodoroTimer } from "../PomodoroTimer";
import { TextToSpeech } from "../TextToSpeech";
import { BionicReader } from "../BionicReader";
import { ColorSeparator } from "../ColorSeparator";
import { FocusMode } from "../FocusMode";
import { LanguageSwitcher } from "../LanguageSwitcher";

export const ToolbarTools = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const tools = [
    { 
      id: "pomodoro", 
      icon: Timer, 
      label: "Pomodoro Timer",
      content: <PomodoroTimer />
    },
    { 
      id: "tts", 
      icon: Headphones, 
      label: "Text to Speech",
      content: <TextToSpeech />
    },
    { 
      id: "bionic", 
      icon: Eye, 
      label: "Bionic Reader",
      content: <BionicReader />
    },
    { 
      id: "color", 
      icon: Paintbrush, 
      label: "Color Tool",
      content: <ColorSeparator />
    },
    { 
      id: "focus", 
      icon: Focus, 
      label: "Focus Mode",
      content: <FocusMode />
    },
    {
      id: "language",
      icon: Globe,
      label: "Language Settings",
      content: <LanguageSwitcher />
    }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveToolId(activeToolId === toolId ? null : toolId);
  };

  return (
    <TooltipProvider>
      {tools.map(({ id, icon: Icon, label, content }) => (
        <Popover key={id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
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
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent 
            className="w-80 p-0 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]" 
            align="end"
          >
            {content}
          </PopoverContent>
        </Popover>
      ))}
    </TooltipProvider>
  );
};