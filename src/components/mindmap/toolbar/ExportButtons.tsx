
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
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExportJpg}>
            <Download className="h-4 w-4 mr-2" />
            Export as Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportJson}>
            <FileDown className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="sm"
        className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
        onClick={onClear}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
