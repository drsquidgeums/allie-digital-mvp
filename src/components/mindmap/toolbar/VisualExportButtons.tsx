
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

interface VisualExportButtonsProps {
  onExportJpg: () => void;
  onExportJson: () => void;
  onExportPdf: () => void;
}

export const VisualExportButtons: React.FC<VisualExportButtonsProps> = ({
  onExportJpg,
  onExportJson,
  onExportPdf,
}) => {
  const exportOptions = [
    {
      type: 'image',
      icon: FileImage,
      label: 'JPG Image',
      color: 'bg-green-500 hover:bg-green-600',
      action: onExportJpg,
      description: 'Save as image'
    },
    {
      type: 'pdf',
      icon: FileText,
      label: 'PDF Document',
      color: 'bg-red-500 hover:bg-red-600',
      action: onExportPdf,
      description: 'Save as PDF'
    },
    {
      type: 'json',
      icon: Download,
      label: 'JSON Data',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: onExportJson,
      description: 'Save as JSON'
    }
  ];

  return (
    <Card className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm border">
      {exportOptions.map((option) => (
        <Tooltip key={option.type}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 w-9 rounded-md ${option.color} hover:scale-105 transition-all duration-200`}
              onClick={option.action}
            >
              <option.icon className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </Card>
  );
};
