import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ToolItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  content: React.ReactNode;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ToolItem = ({ id, icon: Icon, label, content, isActive, onClick }: ToolItemProps) => {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => onClick(id)}
                data-tool-id={id}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </Button>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-fade-in" />
              )}
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
      {isActive && (
        <PopoverContent 
          className="w-80 p-0 border border-border shadow-md dark:bg-workspace-dark dark:text-[#FAFAFA]" 
          align="end"
        >
          {content}
        </PopoverContent>
      )}
    </Popover>
  );
};