import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarButton = ({ icon: Icon, label, isActive, onClick }: SidebarButtonProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"}
      className="w-full flex items-center justify-start gap-2 px-2 focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      style={{ fontWeight: 'inherit' }}
    >
      <Icon className="h-4 w-4" aria-hidden="true" style={{ fontWeight: 'inherit' }} />
      <span style={{ fontWeight: 'inherit' }}>{label}</span>
    </Button>
  );
};