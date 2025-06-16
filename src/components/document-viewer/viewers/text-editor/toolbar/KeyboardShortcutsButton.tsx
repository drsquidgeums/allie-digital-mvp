
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
      <DialogContent className="max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                {shortcut.action}
              </span>
              <kbd className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-mono shadow-sm">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
