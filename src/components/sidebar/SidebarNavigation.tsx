
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, CheckSquare, Brain, FileText } from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface SidebarNavigationProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarNavigation = React.memo(({ activeComponent, setActiveComponent }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    {
      id: "files",
      label: "Toolbox",
      icon: Monitor,
      path: "/toolbox"
    },
    {
      id: "myfiles",
      label: "My Files",
      icon: FileText,
      path: "/my-files"
    },
    {
      id: "tasks",
      label: t('navigation.tasks'),
      icon: CheckSquare,
      path: "/tasks"
    },
    {
      id: "mind-map",
      label: t('navigation.mindMap'),
      icon: Brain,
      path: "/mind-map"
    },
    {
      id: "community",
      label: "Community Hub",
      icon: Brain,
      path: "/community",
      badge: "Coming Soon"
    }
  ];

  const isPathActive = useCallback((path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/file-uploader";
    }
    return location.pathname === path;
  }, [location.pathname]);

  const handleNavigation = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string, path: string) => {
    e.preventDefault();
    setActiveComponent(id);
    navigate(path);
  }, [navigate, setActiveComponent]);

  return (
    <div className="space-y-2" data-sidebar-nav>
      {navigationItems.map(({ id, label, icon, path, badge }) => (
        <div key={id} className="flex items-center relative">
          <SidebarButton
            icon={icon}
            label={label}
            isActive={location.pathname === path}
            onClick={(e) => handleNavigation(e, id, path)}
            className="sidebar-nav-link flex-grow"
          />
          {badge && (
            <Badge 
              variant="default" 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5"
            >
              {badge}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";
