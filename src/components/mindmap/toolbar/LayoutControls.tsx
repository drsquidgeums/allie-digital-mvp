
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  GitBranch, 
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize,
  ArrowRight,
  ArrowDown,
  Grid3X3,
  Circle
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 transition-all duration-200 hover:scale-105"
            aria-label={t('mindMap.autoLayout')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            {t('mindMap.autoLayout')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={`${getDarkModeDropdownClasses()} animate-fade-in`}
        >
          <DropdownMenuItem onClick={() => onApplyLayout('radial')} className="transition-colors duration-200">
            <GitBranch className="h-4 w-4 mr-2" />
            {t('mindMap.radialLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('hierarchical')} className="transition-colors duration-200">
            <LayoutGrid className="h-4 w-4 mr-2" />
            {t('mindMap.hierarchicalLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('force')} className="transition-colors duration-200">
            <Zap className="h-4 w-4 mr-2" />
            {t('mindMap.forceLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('horizontal')} className="transition-colors duration-200">
            <ArrowRight className="h-4 w-4 mr-2" />
            {t('mindMap.horizontalLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('vertical')} className="transition-colors duration-200">
            <ArrowDown className="h-4 w-4 mr-2" />
            {t('mindMap.verticalLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('grid')} className="transition-colors duration-200">
            <Grid3X3 className="h-4 w-4 mr-2" />
            {t('mindMap.gridLayout')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApplyLayout('circular')} className="transition-colors duration-200">
            <Circle className="h-4 w-4 mr-2" />
            {t('mindMap.circularLayout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        {onZoomOut && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onZoomOut} className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95" aria-label={t('mindMap.zoomOut')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">{t('mindMap.zoomOut')}</TooltipContent>
          </Tooltip>
        )}
        
        {onZoomIn && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onZoomIn} className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95" aria-label={t('mindMap.zoomIn')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">{t('mindMap.zoomIn')}</TooltipContent>
          </Tooltip>
        )}
        
        {onFitView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onFitView} className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95" aria-label={t('mindMap.fitView')}>
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fade-in">{t('mindMap.fitView')}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
});

LayoutControls.displayName = 'LayoutControls';