
import React from "react";
import { 
  Users,
  Settings,
  LogOut,
  MessageSquare
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
  onFeedbackClick?: () => void;
}

export const SidebarTools = ({ 
  activeComponent, 
  setActiveComponent, 
  onFeedbackClick 
}: SidebarToolsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: t('common.success'),
      description: t('common.logout'),
    });
    // Force a page reload to return to the password gate
    window.location.reload();
  };

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveComponent("settings");
    navigate("/settings");
  };

  const handleCommunityClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveComponent("community");
    navigate("/community");
  };

  const handleFeedbackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onFeedbackClick) {
      onFeedbackClick();
    }
  };

  return (
    <div className="space-y-2">
      <div className="pt-4 visual-separator space-y-2 nav-tools">
        <div className="hierarchy-secondary text-xs uppercase tracking-wider text-muted-foreground mb-3 px-2">
          Tools
        </div>
        <div className="tool-section">
          <SidebarButton
            icon={Settings}
            label={t('navigation.settings')}
            isActive={location.pathname === "/settings"}
            onClick={handleSettingsClick}
            className="focus-enhanced"
          />
          <SidebarButton
            icon={Users}
            label={t('navigation.community')}
            isActive={location.pathname === "/community"}
            onClick={handleCommunityClick}
            className="focus-enhanced"
          />
          {onFeedbackClick && (
            <div className="task-indicator">
              <SidebarButton
                icon={MessageSquare}
                label="Feedback"
                isActive={false}
                onClick={handleFeedbackClick}
                className="focus-enhanced"
              />
            </div>
          )}
          <SidebarButton
            icon={LogOut}
            label={t('common.logout')}
            isActive={false}
            onClick={handleLogout}
            className="focus-enhanced text-destructive hover:text-destructive"
          />
        </div>
      </div>
    </div>
  );
};
