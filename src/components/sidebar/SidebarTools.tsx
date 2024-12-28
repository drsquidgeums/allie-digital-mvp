import React from "react";
import { 
  Upload,
  Clock,
  Headphones,
  Eye,
  Focus,
  Brain,
  Paintbrush,
  FolderOpen
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarTools = ({ activeComponent, setActiveComponent }: SidebarToolsProps) => {
  const tools = [
    { id: "files", icon: FolderOpen, label: "Files" },
    { id: "color", icon: Paintbrush, label: "Color Tool" },
    { id: "pomodoro", icon: Clock, label: "Pomodoro Timer" },
    { id: "tts", icon: Headphones, label: "Text-to-Speech" },
    { id: "bionic", icon: Eye, label: "Bionic Reader" },
    { id: "focus", icon: Focus, label: "Focus Mode" },
    { id: "mindmap", icon: Brain, label: "Mind Map" },
  ];

  return (
    <div className="space-y-2">
      {tools.map((tool) => (
        <SidebarButton
          key={tool.id}
          icon={tool.icon}
          label={tool.label}
          isActive={activeComponent === tool.id}
          onClick={() => setActiveComponent(tool.id)}
        />
      ))}
    </div>
  );
};