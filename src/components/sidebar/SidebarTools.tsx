
import React from "react";
import { 
  Users,
  Settings,
  LogOut,
  Star,
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
    // Disabled - do nothing
  };

  const handleCommunityClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Disabled - do nothing
  };

  const handleFeedbackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onFeedbackClick) {
      onFeedbackClick();
    }
  };

  return (
    <div className="space-y-2">
      <div className="pt-4 border-t border-border space-y-2">
        <SidebarButton
          icon={Settings}
          label={`${t('navigation.settings')} ★`}
          isActive={false}
          onClick={handleSettingsClick}
          className="text-gray-600 cursor-not-allowed"
          disabled={true}
        />
        <SidebarButton
          icon={Users}
          label={`${t('navigation.community')} ★`}
          isActive={false}
          onClick={handleCommunityClick}
          className="text-gray-600 cursor-not-allowed"
          disabled={true}
        />
        {onFeedbackClick && (
          <SidebarButton
            icon={MessageSquare}
            label="Feedback"
            isActive={false}
            onClick={handleFeedbackClick}
          />
        )}
        <SidebarButton
          icon={LogOut}
          label={t('common.logout')}
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};
