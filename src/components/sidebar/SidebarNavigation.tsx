import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Monitor, CheckSquare, Brain, Bot } from "lucide-react";

interface SidebarNavigationProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarNavigation = React.memo(({ activeComponent, setActiveComponent }: SidebarNavigationProps) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "files",
      label: "File Uploader",
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

  return (
    <div className="space-y-2">
      {navigationItems.map(({ id, label, icon: Icon, path }) => (
        <Button 
          key={id}
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2 focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
          onClick={() => {
            setActiveComponent(id);
            navigate(path);
          }}
          style={{ fontWeight: 'inherit' }}
          aria-current={activeComponent === id ? "page" : undefined}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";