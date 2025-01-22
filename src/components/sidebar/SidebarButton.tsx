import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const SidebarButton = ({ icon: Icon, label, isActive, onClick, className }: SidebarButtonProps) => {
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full flex items-center justify-start gap-2 px-2 transition-all duration-200 ease-in-out
        ${isActive ? 'bg-accent text-accent-foreground ring-2 ring-primary ring-offset-2 dark:ring-offset-workspace-dark' : 'hover:bg-accent/50 hover:text-accent-foreground'}
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-workspace-dark
        sepia:ring-offset-[hsl(35,25%,88%)] sepia:focus-visible:ring-offset-[hsl(35,25%,88%)]
        ${className}`}
      onClick={onClick}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
};