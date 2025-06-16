
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from 'lucide-react';

interface ShapeButtonProps {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}

export const ShapeButton = ({ id, icon: Icon, label, description, onClick }: ShapeButtonProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className="h-8 w-8 rounded-md hover:bg-primary/10 transition-all focus-visible:ring-1 focus-visible:ring-primary dark:text-[#FAFAFA] dark:hover:bg-[#FAFAFA]/10"
          aria-label={description}
        >
          <Icon className="h-4 w-4 text-foreground/80 dark:text-[#FAFAFA]" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        align="center" 
        className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md text-xs font-medium dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
};
