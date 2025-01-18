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
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());

  const tools = [
    { 
      id: "pomodoro", 
      icon: Timer, 
      label: "Pomodoro Timer",
      content: <PomodoroTimer />,
      allowMultiple: false
    },
    { 
      id: "tts", 
      icon: Headphones, 
      label: "Text to Speech",
      content: <TextToSpeech />,
      allowMultiple: true
    },
    { 
      id: "bionic", 
      icon: Eye, 
      label: "Bionic Reader",
      content: <BionicReader />,
      allowMultiple: true
    },
    { 
      id: "color", 
      icon: Paintbrush, 
      label: "Color Tool",
      content: <ColorSeparator />,
      allowMultiple: false
    },
    { 
      id: "focus", 
      icon: Focus, 
      label: "Focus Mode",
      content: <FocusMode />,
      allowMultiple: false
    }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTools(prev => {
      const newActiveTools = new Set(prev);
      const tool = tools.find(t => t.id === toolId);
      
      if (!tool?.allowMultiple) {
        // If tool doesn't allow multiple, deactivate all other tools
        newActiveTools.clear();
      }
      
      if (newActiveTools.has(toolId)) {
        newActiveTools.delete(toolId);
      } else {
        newActiveTools.add(toolId);
      }
      
      return newActiveTools;
    });
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <ToolItem
            key={tool.id}
            {...tool}
            isActive={activeTools.has(tool.id)}
            onClick={handleToolClick}
          />
        ))}
        <LanguageSelector />
      </div>
    </TooltipProvider>
  );
};