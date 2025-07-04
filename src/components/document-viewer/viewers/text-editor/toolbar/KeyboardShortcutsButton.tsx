
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const KeyboardShortcutsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { category: 'Text Formatting', items: [
      { keys: 'Ctrl + B', action: 'Bold' },
      { keys: 'Ctrl + I', action: 'Italic' },
      { keys: 'Ctrl + U', action: 'Underline' },
      { keys: 'Ctrl + Shift + S', action: 'Strikethrough' },
    ]},
    { category: 'Paragraphs & Lists', items: [
      { keys: 'Ctrl + Shift + 7', action: 'Ordered List' },
      { keys: 'Ctrl + Shift + 8', action: 'Bullet List' },
      { keys: 'Ctrl + Shift + 9', action: 'Task List' },
      { keys: 'Ctrl + ]', action: 'Indent' },
      { keys: 'Ctrl + [', action: 'Outdent' },
    ]},
    { category: 'Headings', items: [
      { keys: 'Ctrl + Alt + 1', action: 'Heading 1' },
      { keys: 'Ctrl + Alt + 2', action: 'Heading 2' },
      { keys: 'Ctrl + Alt + 3', action: 'Heading 3' },
      { keys: 'Ctrl + Alt + 0', action: 'Paragraph' },
    ]},
    { category: 'Text Alignment', items: [
      { keys: 'Ctrl + Shift + L', action: 'Align Left' },
      { keys: 'Ctrl + Shift + E', action: 'Align Center' },
      { keys: 'Ctrl + Shift + R', action: 'Align Right' },
      { keys: 'Ctrl + Shift + J', action: 'Justify' },
    ]},
    { category: 'General', items: [
      { keys: 'Ctrl + Z', action: 'Undo' },
      { keys: 'Ctrl + Y', action: 'Redo' },
      { keys: 'Ctrl + A', action: 'Select All' },
      { keys: 'Ctrl + F', action: 'Find' },
      { keys: 'Ctrl + S', action: 'Save' },
    ]},
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Show keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard Shortcuts</TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to work more efficiently
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold text-sm mb-3 text-primary">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut) => (
                  <div 
                    key={shortcut.keys} 
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{shortcut.action}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> On Mac, use Cmd instead of Ctrl for most shortcuts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
