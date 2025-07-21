import React from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FontSelector } from "@/components/FontSelector";
import { globalFontState } from "@/utils/fontStateManager";

export const TextTool = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFont, setSelectedFont] = React.useState(globalFontState.selectedFont);

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
              >
                <Type className="h-4 w-4" />
                {isOpen && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    role="status"
                    aria-label="Text tool active"
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
          Text Options
        </TooltipContent>
      </Tooltip>
      <PopoverContent 
        className="w-80 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        align="end"
      >
        <div className="space-y-4 p-2">
          <div className="font-medium text-sm">Text Options</div>
          <FontSelector
            selectedFont={selectedFont}
            onFontChange={setSelectedFont}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};