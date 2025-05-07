
import React, { useRef } from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onColorChange: (color: string) => void;
}

export const Sidebar = React.memo(({ 
  onColorChange
}: SidebarProps) => {
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      sidebarRef.current?.focus();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div 
      ref={sidebarRef}
      className="w-64 bg-card border-r border-border p-4 flex flex-col h-screen overflow-y-auto relative"
      role="navigation"
      aria-label="Main navigation"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SidebarLogo />
      
      <div className="space-y-2 flex-1">
        <SidebarNavigation 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        <SidebarTools 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
      </div>
      
      <SidebarContent 
        activeComponent={activeComponent}
        onColorChange={onColorChange}
      />

      <div className="absolute bottom-14 left-4 right-4 flex justify-between items-center">
        <ThemeToggle />
        
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
