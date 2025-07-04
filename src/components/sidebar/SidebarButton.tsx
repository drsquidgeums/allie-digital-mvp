
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const SidebarButton = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  className,
  disabled = false
}: SidebarButtonProps) => {
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full flex items-center justify-start gap-2 px-2 transition-all duration-200 ease-in-out",
        "border border-transparent",
        isActive && !disabled && "bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2 border-primary/30",
        !isActive && !disabled && "hover:bg-accent/80 hover:text-accent-foreground hover:border-accent-foreground/20",
        !disabled && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        !disabled && "focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "dark:ring-offset-workspace-dark dark:hover:border-white/10",
        "dark:focus-visible:ring-offset-workspace-dark",
        "dark:focus:ring-offset-workspace-dark",
        className
      )}
      onClick={onClick}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
};
