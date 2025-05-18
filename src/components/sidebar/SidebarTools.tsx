
import React from "react";
import { 
  Users,
  Settings,
  LogOut,
  Star
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarTools = ({ activeComponent, setActiveComponent }: SidebarToolsProps) => {
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

  return (
    <div className="space-y-2">
      <div className="pt-4 border-t border-border space-y-2">
        <SidebarButton
          icon={Settings}
          label={`${t('navigation.settings')} ★`}
          isActive={false}
          onClick={handleSettingsClick}
          className="text-gray-500 cursor-not-allowed"
          disabled={true}
        />
        <SidebarButton
          icon={Users}
          label={`${t('navigation.community')} ★`}
          isActive={false}
          onClick={handleCommunityClick}
          className="text-gray-500 cursor-not-allowed"
          disabled={true}
        />
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
