
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
        "w-full flex items-center justify-start gap-3 px-3 py-2 transition-all duration-300 ease-in-out button-enhanced",
        isActive && !disabled && "bg-primary/10 text-primary border-l-4 border-primary shadow-sm",
        !isActive && !disabled && "hover:bg-accent/50 hover:text-accent-foreground hover:translate-x-1",
        !disabled && "focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-4",
        !disabled && "focus:ring-4 focus:ring-primary/50 focus:ring-offset-4",
        "dark:ring-offset-workspace-dark",
        "dark:focus-visible:ring-offset-workspace-dark",
        "dark:focus:ring-offset-workspace-dark",
        "sepia:ring-offset-[hsl(35,25%,88%)]",
        "sepia:focus-visible:ring-offset-[hsl(35,25%,88%)]", 
        "sepia:focus:ring-offset-[hsl(35,25%,88%)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
    >
      <div className={cn(
        "icon-state transition-all duration-200",
        isActive && "text-primary scale-110"
      )}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <span className={cn(
        "font-medium transition-all duration-200",
        isActive && "text-primary"
      )}>
        {label}
      </span>
      {isActive && (
        <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </Button>
  );
};
