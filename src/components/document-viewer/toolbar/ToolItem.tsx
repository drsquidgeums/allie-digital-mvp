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
  popoverClassName?: string;
}

export const ToolItem = ({ 
  id, 
  icon: Icon, 
  label, 
  content, 
  isActive = false, 
  onClick,
  popoverClassName 
}: ToolItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.(id);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isOpen ? "bg-primary text-primary-foreground ring-2 ring-primary" : ""
                }`}
                onClick={handleClick}
                data-tool-id={id}
              >
                <Icon className="h-4 w-4" />
                {isOpen && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    role="status"
                    aria-label={`${label} tool active`}
                  />
                )}
              </Button>
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
        >
          {label}
        </TooltipContent>
      </Tooltip>
      {content && (
        <PopoverContent 
          className={popoverClassName}
          align="end"
        >
          {content}
        </PopoverContent>
      )}
    </Popover>
  );
};