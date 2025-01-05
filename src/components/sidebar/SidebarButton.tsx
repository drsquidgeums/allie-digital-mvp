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
  return (
    <Button 
      variant={isActive ? "default" : "ghost"}
      className="w-full flex items-center justify-start gap-2 px-2 font-inherit text-inherit"
      onClick={onClick}
      style={{ fontWeight: 'inherit' }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
};