
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonsProps {
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportJpg,
  onExportJson,
  onClear,
}) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm h-9 px-3 bg-background/80 border-border/60 hover:bg-background/90">
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onExportJpg} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export as Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportJson} className="cursor-pointer">
            <FileDown className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="sm"
        className="h-9 px-3 text-destructive hover:text-destructive border-border/60 hover:bg-destructive/5 hover:border-destructive/30"
        onClick={onClear}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
