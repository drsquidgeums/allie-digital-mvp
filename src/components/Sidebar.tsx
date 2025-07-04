
import React, { useRef, useState } from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  onColorChange: (color: string) => void;
}

export const Sidebar = React.memo(({ 
  onColorChange
}: SidebarProps) => {
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  
  // Get user info from localStorage
  React.useEffect(() => {
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsedAgreement = JSON.parse(ndaAgreement);
        setUserInfo({
          name: parsedAgreement.name,
          email: parsedAgreement.email
        });
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      sidebarRef.current?.focus();
    }
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

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
