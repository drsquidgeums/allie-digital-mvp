import React from "react";
import { 
  Clock,
  Headphones,
  Eye,
  Focus,
  Paintbrush,
  FolderOpen,
  Users,
  LogOut
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarTools = ({ activeComponent, setActiveComponent }: SidebarToolsProps) => {
  const tools = [
    { id: "files", icon: FolderOpen, label: "File Uploads" },
    { id: "color", icon: Paintbrush, label: "Color Tool" },
    { id: "pomodoro", icon: Clock, label: "Pomodoro Timer" },
    { id: "tts", icon: Headphones, label: "Text-to-Speech" },
    { id: "bionic", icon: Eye, label: "Bionic Reader" },
    { id: "focus", icon: Focus, label: "Focus Mode" },
  ];

  const handleLogout = () => {
    // Add logout logic here when needed
    console.log("Logout clicked");
  };

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
      
      <div className="pt-4 border-t border-border">
        <SidebarButton
          icon={Users}
          label="Community"
          isActive={activeComponent === "community"}
          onClick={() => setActiveComponent("community")}
        />
        <SidebarButton
          icon={LogOut}
          label="Logout"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};