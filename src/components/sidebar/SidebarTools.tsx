import React from "react";
import { 
  Settings,
  LogOut,
  MessageSquare
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('common.success'),
        description: t('common.logout'),
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveComponent("settings");
    navigate("/settings");
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
          label={t('navigation.settings')}
          isActive={location.pathname === "/settings"}
          onClick={handleSettingsClick}
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
