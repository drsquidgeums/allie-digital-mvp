
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
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

interface LayoutControlsProps {
  onApplyLayout: (layoutType: LayoutType) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = React.memo(({
  onApplyLayout,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 transition-all duration-200 hover:scale-105"
            aria-label="Auto layout options"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Auto Layout
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={`${getDarkModeDropdownClasses()} animate-fade-in`}
        >
          <DropdownMenuItem 
            onClick={() => onApplyLayout('radial')}
            className="transition-colors duration-200"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Radial Layout
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onApplyLayout('hierarchical')}
            className="transition-colors duration-200"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Hierarchical Layout
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onApplyLayout('force')}
            className="transition-colors duration-200"
          >
            <Zap className="h-4 w-4 mr-2" />
            Force Layout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        {onZoomOut && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomOut} 
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">Zoom Out</TooltipContent>
          </Tooltip>
        )}
        
        {onZoomIn && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomIn} 
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">Zoom In</TooltipContent>
          </Tooltip>
        )}
        
        {onFitView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFitView} 
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Fit to view"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">Fit to View</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
});

LayoutControls.displayName = 'LayoutControls';
