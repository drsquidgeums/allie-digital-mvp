import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
      <Button 
        onClick={() => {
          onExportJpg();
          toast("Mind map exported as JPG");
        }} 
        variant="outline" 
        size="icon" 
        className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
        aria-label="Export as JPG"
      >
        <Download className="w-4 h-4 text-foreground" aria-hidden="true" />
      </Button>
      <Button 
        onClick={() => {
          onExportJson();
          toast("Mind map exported as JSON");
        }} 
        variant="outline" 
        size="icon" 
        className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
        aria-label="Export as JSON"
      >
        <span className="text-[10px] font-medium">JSON</span>
      </Button>
      <Button 
        onClick={() => {
          onClear();
          toast("Canvas cleared");
        }} 
        variant="outline" 
        size="icon" 
        className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
        aria-label="Clear canvas"
      >
        <Trash2 className="w-4 h-4 text-foreground" aria-hidden="true" />
      </Button>
    </div>
  );
};