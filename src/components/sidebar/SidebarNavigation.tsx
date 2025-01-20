import React, { useCallback } from "react";
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

  const isPathActive = useCallback((path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/file-uploader";
    }
    return location.pathname === path;
  }, [location.pathname]);

  const handleNavigation = useCallback((e: React.MouseEvent, id: string, path: string) => {
    e.preventDefault(); // Prevent default navigation
    setActiveComponent(id);
    navigate(path);
  }, [navigate, setActiveComponent]);

  return (
    <div className="space-y-2" data-sidebar-nav>
      {navigationItems.map(({ id, label, icon: Icon, path }) => (
        <SidebarButton
          key={id}
          icon={Icon}
          label={label}
          isActive={isPathActive(path)}
          onClick={(e) => handleNavigation(e, id, path)}
          className="sidebar-nav-link"
        />
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";