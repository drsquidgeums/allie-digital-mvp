
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
          className="h-8 w-8 rounded-md hover:bg-primary/10 focus:ring-1 focus:ring-ring"
          aria-label={description}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{description}</TooltipContent>
    </Tooltip>
  );
};
