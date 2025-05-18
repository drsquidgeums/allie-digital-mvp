
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, CheckSquare, Brain, FileText } from "lucide-react";
import { SidebarButton } from "./SidebarButton";
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
      label: t('navigation.workspace'),
      icon: Monitor,
      path: "/toolbox"
    },
    {
      id: "myfiles",
      label: t('navigation.myFiles'),
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
      {navigationItems.map(({ id, label, icon, path }) => (
        <SidebarButton
          key={id}
          icon={icon}
          label={label}
          isActive={location.pathname === path}
          onClick={(e) => handleNavigation(e, id, path)}
          className="sidebar-nav-link"
        />
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";
