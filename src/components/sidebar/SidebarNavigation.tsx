
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, CheckSquare, Brain, FileText, TrendingUp } from "lucide-react";
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
      disabled: false,
      tourId: "toolbox"
    },
    {
      id: "myfiles",
      label: t('navigation.myFiles'),
      icon: FileText,
      path: "/my-files",
      disabled: false,
      tourId: "myfiles"
    },
    {
      id: "tasks",
      label: t('navigation.tasks'),
      icon: CheckSquare,
      path: "/tasks",
      disabled: false,
      tourId: "tasks"
    },
    {
      id: "mind-map",
      label: t('navigation.mindMap'),
      icon: Brain,
      path: "/mind-map",
      disabled: false,
      tourId: "mindmap"
    },
    {
      id: "progress",
      label: t('navigation.progress', 'Progress'),
      icon: TrendingUp,
      path: "/progress",
      disabled: false,
      tourId: "progress"
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
    <div className="space-y-2" data-tour="sidebar">
      {navigationItems.map(({ id, label, icon, path, disabled, tourId }) => (
        <div key={id} data-tour={tourId}>
          <SidebarButton
            icon={icon}
            label={label}
            isActive={location.pathname === path}
            onClick={(e) => handleNavigation(e, id, path, disabled)}
            className={disabled ? "text-gray-600 cursor-not-allowed" : ""}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";
