
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Target, Calendar, Lightbulb, Layers } from "lucide-react";

interface VisualTemplateSelectorProps {
  onLoadTemplate: (templateNodes: any[]) => void;
}

export const VisualTemplateSelector: React.FC<VisualTemplateSelectorProps> = ({
  onLoadTemplate,
}) => {
  const templates = [
    {
      id: 'swot',
      name: 'SWOT Analysis',
      icon: Target,
      color: 'bg-red-500',
      preview: (
        <div className="w-16 h-12 bg-red-100 rounded border flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-2 h-2 bg-red-400 rounded"></div>
            <div className="w-2 h-2 bg-red-400 rounded"></div>
            <div className="w-2 h-2 bg-red-400 rounded"></div>
            <div className="w-2 h-2 bg-red-400 rounded"></div>
          </div>
        </div>
      ),
      nodes: [
        { type: 'default', data: { label: 'SWOT Analysis' }, position: { x: 250, y: 50 } },
        { type: 'default', data: { label: 'Strengths' }, position: { x: 100, y: 150 } },
        { type: 'default', data: { label: 'Weaknesses' }, position: { x: 400, y: 150 } },
        { type: 'default', data: { label: 'Opportunities' }, position: { x: 100, y: 250 } },
        { type: 'default', data: { label: 'Threats' }, position: { x: 400, y: 250 } },
      ]
    },
    {
      id: 'project',
      name: 'Project Plan',
      icon: Calendar,
      color: 'bg-blue-500',
      preview: (
        <div className="w-16 h-12 bg-blue-100 rounded border flex items-center justify-center">
          <div className="flex flex-col gap-1">
            <div className="w-8 h-1 bg-blue-400 rounded"></div>
            <div className="w-6 h-1 bg-blue-400 rounded"></div>
            <div className="w-10 h-1 bg-blue-400 rounded"></div>
          </div>
        </div>
      ),
      nodes: [
        { type: 'default', data: { label: 'Project Plan' }, position: { x: 250, y: 50 } },
        { type: 'default', data: { label: 'Phase 1' }, position: { x: 100, y: 150 } },
        { type: 'default', data: { label: 'Phase 2' }, position: { x: 250, y: 150 } },
        { type: 'default', data: { label: 'Phase 3' }, position: { x: 400, y: 150 } },
      ]
    },
    {
      id: 'brainstorm',
      name: 'Brainstorm',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      preview: (
        <div className="w-16 h-12 bg-yellow-100 rounded border flex items-center justify-center">
          <div className="relative">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      ),
      nodes: [
        { type: 'default', data: { label: 'Main Idea' }, position: { x: 250, y: 150 } },
        { type: 'default', data: { label: 'Idea 1' }, position: { x: 100, y: 100 } },
        { type: 'default', data: { label: 'Idea 2' }, position: { x: 400, y: 100 } },
        { type: 'default', data: { label: 'Idea 3' }, position: { x: 100, y: 200 } },
        { type: 'default', data: { label: 'Idea 4' }, position: { x: 400, y: 200 } },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3">
          <Layers className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="grid grid-cols-1 gap-2 p-2">
          {templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => onLoadTemplate(template.nodes)}
              className="cursor-pointer p-3 hover:bg-accent rounded-md"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-md ${template.color}`}>
                  <template.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{template.name}</div>
                </div>
                <div className="ml-auto">
                  {template.preview}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
