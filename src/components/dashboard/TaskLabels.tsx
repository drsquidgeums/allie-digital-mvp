
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskLabelsProps {
  labels: string[];
  onAddLabel: (label: string) => void;
  onRemoveLabel: (label: string) => void;
  availableLabels?: string[];
}

const DEFAULT_LABELS = [
  "urgent", "important", "bug", "feature", "documentation", 
  "testing", "review", "blocked", "in-progress", "done"
];

const LABEL_COLORS = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200", 
  "bg-green-100 text-green-800 border-green-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-gray-100 text-gray-800 border-gray-200",
  "bg-teal-100 text-teal-800 border-teal-200"
];

export const TaskLabels: React.FC<TaskLabelsProps> = ({
  labels,
  onAddLabel,
  onRemoveLabel,
  availableLabels = DEFAULT_LABELS
}) => {
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const getLabelColor = (label: string) => {
    const index = Math.abs(label.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % LABEL_COLORS.length;
    return LABEL_COLORS[index];
  };

  const handleAddLabel = (label: string) => {
    if (label.trim() && !labels.includes(label.trim())) {
      onAddLabel(label.trim());
    }
    setNewLabel('');
    setShowLabelInput(false);
  };

  const unusedLabels = availableLabels.filter(label => !labels.includes(label));

  return (
    <div className="space-y-2">
      {/* Current Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {labels.map((label) => (
            <Badge
              key={label}
              variant="outline"
              className={cn("text-xs", getLabelColor(label))}
            >
              {label}
              <button
                onClick={() => onRemoveLabel(label)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Label Section */}
      {!showLabelInput ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowLabelInput(true)}
          className="h-6 text-xs text-muted-foreground"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Label
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-1">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Enter label name"
              className="h-6 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddLabel(newLabel);
                } else if (e.key === 'Escape') {
                  setShowLabelInput(false);
                  setNewLabel('');
                }
              }}
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => handleAddLabel(newLabel)}
              className="h-6 px-2"
            >
              Add
            </Button>
          </div>
          
          {/* Quick Add from Available Labels */}
          {unusedLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {unusedLabels.slice(0, 6).map((label) => (
                <button
                  key={label}
                  onClick={() => handleAddLabel(label)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border transition-colors hover:opacity-80",
                    getLabelColor(label)
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
