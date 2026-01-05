
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
      path: "/toolbox",
      disabled: false
    },
    {
      id: "myfiles",
      label: t('navigation.myFiles'),
      icon: FileText,
      path: "/my-files",
      disabled: false
    },
    {
      id: "tasks",
      label: t('navigation.tasks'),
      icon: CheckSquare,
      path: "/tasks",
      disabled: false
    },
    {
      id: "mind-map",
      label: t('navigation.mindMap'),
      icon: Brain,
      path: "/mind-map",
      disabled: false
    }
  ];

  const isPathActive = useCallback((path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/file-uploader";
    }
    return location.pathname === path;
  }, [location.pathname]);

  const handleNavigation = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string, path: string, disabled: boolean) => {
    e.preventDefault();
    if (disabled) return;
    
    setActiveComponent(id);
    navigate(path);
  }, [navigate, setActiveComponent]);

  return (
    <div className="space-y-2" data-sidebar-nav>
      {navigationItems.map(({ id, label, icon, path, disabled }) => (
        <SidebarButton
          key={id}
          icon={icon}
          label={label}
          isActive={location.pathname === path}
          onClick={(e) => handleNavigation(e, id, path, disabled)}
          className={disabled ? "text-gray-600 cursor-not-allowed" : ""}
          disabled={disabled}
        />
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";
