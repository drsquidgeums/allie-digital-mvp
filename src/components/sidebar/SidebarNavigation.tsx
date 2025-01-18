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
    // For root path, only match exact "/"
    if (path === "/") {
      return location.pathname === "/";
    }
    // For other paths, match exactly
    return location.pathname === path;
  };

  return (
    <div className="space-y-2">
      {navigationItems.map(({ id, label, icon: Icon, path }) => (
        <SidebarButton
          key={id}
          icon={Icon}
          label={label}
          isActive={isPathActive(path)}
          onClick={() => {
            setActiveComponent(id);
            navigate(path);
          }}
        />
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";