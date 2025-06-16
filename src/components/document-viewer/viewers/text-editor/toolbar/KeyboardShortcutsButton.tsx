
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

export const KeyboardShortcutsButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl + B', action: 'Bold' },
    { keys: 'Ctrl + I', action: 'Italic' },
    { keys: 'Ctrl + U', action: 'Underline' },
    { keys: 'Ctrl + Z', action: 'Undo' },
    { keys: 'Ctrl + Y', action: 'Redo' },
    { keys: 'Ctrl + Shift + Z', action: 'Redo (alternative)' },
    { keys: 'Ctrl + A', action: 'Select All' },
    { keys: 'Ctrl + C', action: 'Copy' },
    { keys: 'Ctrl + V', action: 'Paste' },
    { keys: 'Ctrl + X', action: 'Cut' },
    { keys: 'Ctrl + 1', action: 'Heading 1' },
    { keys: 'Ctrl + 2', action: 'Heading 2' },
    { keys: 'Ctrl + 3', action: 'Heading 3' },
    { keys: 'Ctrl + Shift + L', action: 'Align Left' },
    { keys: 'Ctrl + Shift + E', action: 'Align Center' },
    { keys: 'Ctrl + Shift + R', action: 'Align Right' },
    { keys: 'Ctrl + Shift + J', action: 'Justify' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-80 overflow-y-auto bg-background">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex justify-between items-center py-2 px-1">
              <span className="text-sm text-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border border-border font-mono">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
