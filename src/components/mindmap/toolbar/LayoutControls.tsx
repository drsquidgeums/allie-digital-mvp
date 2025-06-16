
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  GitBranch, 
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutType } from '../hooks/useAutoLayout';

interface LayoutControlsProps {
  onApplyLayout: (layoutType: LayoutType) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  onApplyLayout,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3">
            <LayoutGrid className="h-4 w-4 mr-1" />
            Auto Layout
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        >
          <DropdownMenuItem onClick={() => onApplyLayout('radial')}>
            <GitBranch className="h-4 w-4 mr-2" />
            Radial Layout
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('hierarchical')}>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Hierarchical Layout
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('force')}>
            <Zap className="h-4 w-4 mr-2" />
            Force Layout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        {onZoomOut && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onZoomOut} className="h-9 w-9 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        )}
        
        {onZoomIn && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onZoomIn} className="h-9 w-9 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        )}
        
        {onFitView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onFitView} className="h-9 w-9 p-0">
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit to View</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
