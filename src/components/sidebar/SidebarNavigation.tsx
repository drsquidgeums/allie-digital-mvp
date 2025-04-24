
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, CheckSquare, Brain, FileText, BadgeInfo } from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

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
      id: "community", // Add community item with badge
      label: "Community",
      icon: BadgeInfo,
      path: "/community",
      badge: true
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
      {navigationItems.map(({ id, label, icon: Icon, path, badge }) => (
        <div key={id} className="relative flex items-center">
          <SidebarButton
            icon={Icon}
            label={label}
            isActive={location.pathname === path}
            onClick={(e) => handleNavigation(e, id, path)}
            className="sidebar-nav-link w-full"
          />
          {badge && (
            <Badge 
              variant="secondary" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-1.5 py-0.5 text-[10px] rounded-full"
            >
              Coming Soon
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
});

SidebarNavigation.displayName = "SidebarNavigation";

