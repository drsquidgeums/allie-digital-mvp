
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VisualLayoutControlsProps {
  onApplyLayout: (layoutType: 'radial' | 'hierarchical' | 'force') => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const VisualLayoutControls: React.FC<VisualLayoutControlsProps> = ({
  onApplyLayout,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const layouts = [
    {
      type: 'radial',
      name: 'Radial',
      preview: (
        <div className="w-12 h-8 bg-blue-100 rounded border flex items-center justify-center">
          <div className="relative">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute -top-1 -left-2 w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="absolute -top-1 -right-2 w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-2 w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-1 -right-2 w-1 h-1 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      type: 'hierarchical',
      name: 'Hierarchical',
      preview: (
        <div className="w-12 h-8 bg-green-100 rounded border flex items-center justify-center">
          <div className="flex flex-col gap-1">
            <div className="w-4 h-1 bg-green-500 rounded mx-auto"></div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-green-400 rounded"></div>
              <div className="w-1 h-1 bg-green-400 rounded"></div>
              <div className="w-1 h-1 bg-green-400 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'force',
      name: 'Force',
      preview: (
        <div className="w-12 h-8 bg-purple-100 rounded border flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-1 h-1 bg-purple-500 rounded"></div>
            <div className="w-1 h-1 bg-purple-400 rounded"></div>
            <div className="w-1 h-1 bg-purple-400 rounded"></div>
            <div className="w-1 h-1 bg-purple-500 rounded"></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded"></div>
              </div>
              Layout
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {layouts.map((layout) => (
            <DropdownMenuItem
              key={layout.type}
              onClick={() => onApplyLayout(layout.type as 'radial' | 'hierarchical' | 'force')}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="font-medium">{layout.name}</div>
                <div className="ml-auto">
                  {layout.preview}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Card className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm">
        {onZoomOut && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0 hover:scale-105 transition-all duration-200"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        )}
        
        {onZoomIn && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0 hover:scale-105 transition-all duration-200"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        )}
        
        {onFitView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFitView}
                className="h-8 w-8 p-0 hover:scale-105 transition-all duration-200"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit View</TooltipContent>
          </Tooltip>
        )}
      </Card>
    </div>
  );
};
