
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Type, Square, Circle, Triangle, Diamond, Hexagon, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

interface FloatingAddButtonProps {
  onAddNode: (type: string, label?: string) => void;
  position: { x: number; y: number };
  isVisible: boolean;
  onClose: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onAddNode,
  position,
  isVisible,
  onClose
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const quickAddOptions = [
    { type: 'text', icon: Type, label: 'Text', color: 'bg-blue-500' },
    { type: 'square', icon: Square, label: 'Square', color: 'bg-green-500' },
    { type: 'circle', icon: Circle, label: 'Circle', color: 'bg-purple-500' },
    { type: 'triangle', icon: Triangle, label: 'Triangle', color: 'bg-orange-500' },
    { type: 'diamond', icon: Diamond, label: 'Diamond', color: 'bg-pink-500' },
    { type: 'hexagon', icon: Hexagon, label: 'Hexagon', color: 'bg-indigo-500' },
    { type: 'star', icon: Star, label: 'Star', color: 'bg-yellow-500' },
  ];

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x - 30,
        top: position.y - 30,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative pointer-events-auto">
        <Button
          size="sm"
          className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg animate-scale-in"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
        
        {showQuickAdd && (
          <Card className="absolute top-14 left-1/2 transform -translate-x-1/2 p-2 bg-background/95 backdrop-blur-sm border shadow-xl animate-fade-in">
            <div className="flex gap-2">
              {quickAddOptions.map((option) => (
                <Tooltip key={option.type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-10 w-10 rounded-full ${option.color} hover:scale-110 transition-all duration-200`}
                      onClick={() => {
                        onAddNode(option.type, option.label);
                        onClose();
                      }}
                    >
                      <option.icon className="h-4 w-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add {option.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
