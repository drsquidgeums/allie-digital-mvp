
import React, { useRef } from "react";
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

      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
