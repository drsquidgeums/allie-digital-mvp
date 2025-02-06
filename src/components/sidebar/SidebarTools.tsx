import React from "react";
import { 
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string) => void;
}

export const SidebarTools = ({ activeComponent, setActiveComponent }: SidebarToolsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Force a page reload to return to the password gate
    window.location.reload();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleCommunityClick = () => {
    navigate('/community');
  };

  return (
    <div className="space-y-2">
      <div className="pt-4 border-t border-border">
        <SidebarButton
          icon={Settings}
          label="Settings"
          isActive={location.pathname === '/settings'}
          onClick={handleSettingsClick}
        />
        <SidebarButton
          icon={Users}
          label="Community"
          isActive={location.pathname === '/community'}
          onClick={handleCommunityClick}
        />
        <SidebarButton
          icon={LogOut}
          label="Logout"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};