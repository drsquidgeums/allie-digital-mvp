
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Target, Calendar, Lightbulb, Layers, Scale, HelpCircle, Clock, CalendarDays, GitFork, BookOpen, Briefcase } from "lucide-react";
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';
import { NODE_TEMPLATES } from '../constants/nodeTemplates';
import { useTranslation } from 'react-i18next';

interface VisualTemplateSelectorProps {
  onLoadTemplate: (templateNodes: any[]) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  analysis: Target,
  planning: Calendar,
  creative: Lightbulb,
  business: Briefcase,
};

const templateIcons: Record<string, React.ElementType> = {
  'swot': Target,
  'pros-cons': Scale,
  'five-whys': HelpCircle,
  'project-planning': Calendar,
  'timeline': Clock,
  'weekly-plan': CalendarDays,
  'brainstorm': Lightbulb,
  'decision-tree': GitFork,
  'study-notes': BookOpen,
  'business-model': Briefcase,
};

export const VisualTemplateSelector: React.FC<VisualTemplateSelectorProps> = ({
  onLoadTemplate,
}) => {
  const { t } = useTranslation();

  const grouped = NODE_TEMPLATES.reduce((acc, tmpl) => {
    if (!acc[tmpl.category]) acc[tmpl.category] = [];
    acc[tmpl.category].push(tmpl);
    return acc;
  }, {} as Record<string, typeof NODE_TEMPLATES>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3 transition-all duration-200 hover:scale-105">
          <Layers className="h-4 w-4 mr-1" />
          {t('mindMap.templates')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`w-64 max-h-80 overflow-y-auto ${getDarkModeDropdownClasses()} animate-fade-in`}>
        {Object.entries(grouped).map(([category, templates], catIdx) => (
          <div key={category}>
            <DropdownMenuLabel className="capitalize text-xs text-muted-foreground">
              {t(`mindMap.${category}`)}
            </DropdownMenuLabel>
            {templates.map((template) => {
              const Icon = templateIcons[template.id] || Layers;
              return (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onLoadTemplate(template.nodes)}
                  className="cursor-pointer transition-colors duration-200"
                >
                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            {catIdx < Object.keys(grouped).length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};