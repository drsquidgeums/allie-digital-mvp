import React, { useState } from "react";
import { Timer, Headphones, Eye, Paintbrush, Focus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PomodoroTimer } from "../PomodoroTimer";
import { TextToSpeech } from "../TextToSpeech";
import { BionicReader } from "../BionicReader";
import { ColorSeparator } from "../ColorSeparator";
import { FocusMode } from "../FocusMode";
import { ToolItem } from "./toolbar/ToolItem";
import { LanguageSelector } from "./toolbar/LanguageSelector";

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
    }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveToolId(activeToolId === toolId ? null : toolId);
  };

  return (
    <TooltipProvider>
      {tools.map((tool) => (
        <ToolItem
          key={tool.id}
          {...tool}
          isActive={activeToolId === tool.id}
          onClick={handleToolClick}
        />
      ))}
      <LanguageSelector />
    </TooltipProvider>
  );
};