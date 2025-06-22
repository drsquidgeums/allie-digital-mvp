
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText,
  Target,
  Calendar,
  Lightbulb
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { NODE_TEMPLATES, NodeTemplate } from '../constants/nodeTemplates';
import { MindMapNode } from '../types';
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

interface TemplateSelectorProps {
  onLoadTemplate: (templateNodes: Omit<MindMapNode, 'id'>[]) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'analysis':
      return Target;
    case 'planning':
      return Calendar;
    case 'creative':
      return Lightbulb;
    default:
      return FileText;
  }
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = React.memo(({
  onLoadTemplate,
}) => {
  const groupedTemplates = NODE_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, NodeTemplate[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 transition-all duration-200 hover:scale-105"
          aria-label="Select template"
        >
          <FileText className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-56 ${getDarkModeDropdownClasses()} animate-fade-in`}
      >
        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category}>
            <DropdownMenuLabel className="capitalize">
              {category}
            </DropdownMenuLabel>
            {templates.map((template) => {
              const Icon = getCategoryIcon(template.category);
              return (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onLoadTemplate(template.nodes)}
                  className="cursor-pointer transition-colors duration-200"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

TemplateSelector.displayName = 'TemplateSelector';
