
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const exportOptions = [
    {
      type: 'image',
      icon: FileImage,
      labelKey: 'mindMap.jpgImage',
      color: 'bg-green-500 hover:bg-green-600',
      action: onExportJpg,
      descKey: 'mindMap.saveAsImage'
    },
    {
      type: 'pdf',
      icon: FileText,
      labelKey: 'mindMap.pdfDocument',
      color: 'bg-red-500 hover:bg-red-600',
      action: onExportPdf,
      descKey: 'mindMap.saveAsPdf'
    },
    {
      type: 'json',
      icon: Download,
      labelKey: 'mindMap.jsonData',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: onExportJson,
      descKey: 'mindMap.saveAsJson'
    }
  ];

  return (
    <>
      {exportOptions.map((option) => (
        <Tooltip key={option.type}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 w-9 p-0 ${option.color} hover:scale-105 transition-all duration-200`}
              onClick={option.action}
            >
              <option.icon className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-center">
              <div className="font-medium">{t(option.labelKey)}</div>
              <div className="text-xs text-muted-foreground">{t(option.descKey)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
};