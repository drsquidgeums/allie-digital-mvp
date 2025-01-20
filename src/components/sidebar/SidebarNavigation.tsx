import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, CheckSquare, Brain, Bot } from "lucide-react";
import { SidebarButton } from "./SidebarButton";

interface SidebarNavigationProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarNavigation = React.memo(({ activeComponent, setActiveComponent }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: "files",
      label: "Toolbox",
      icon: Monitor,
      path: "/"
    },
    {
      id: "tasks",
      label: "Task Planner",
      icon: CheckSquare,
      path: "/tasks"
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Bot,
      path: "/ai-assistant"
    },
    {
      id: "mind-map",
      label: "Mind Map",
      icon: Brain,
      path: "/mind-map"
    }
  ];

  const isPathActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  const handleItemClick = (id: string, path: string) => {
    setActiveComponent(id);
    // Only navigate if we're actually changing routes
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-2">
      {navigationItems.map(({ id, label, icon: Icon, path }) => (
        <SidebarButton
          key={id}
          icon={Icon}
          label={label}
          isActive={isPathActive(path)}
          onClick={() => handleItemClick(id, path)}
        />
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";