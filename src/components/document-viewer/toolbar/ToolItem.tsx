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
  content?: React.ReactNode;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export const ToolItem = ({ id, icon: Icon, label, content, isActive = false, onClick }: ToolItemProps) => {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                onClick={() => onClick?.(id)}
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
        <TooltipContent 
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm shadow-md transition-colors duration-200"
        >
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
      {isActive && content && (
        <PopoverContent 
          className="w-80 p-0 shadow-md dark:bg-workspace-dark dark:text-[#FAFAFA]" 
          align="end"
        >
          {content}
        </PopoverContent>
      )}
    </Popover>
  );
};