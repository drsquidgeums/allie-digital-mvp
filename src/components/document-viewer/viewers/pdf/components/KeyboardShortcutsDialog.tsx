
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog/dialog-root';
import { DialogFooter } from '@/components/ui/dialog/dialog-footer';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutItemProps {
  keys: string[];
  description: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ keys, description }) => (
  <div className="flex justify-between items-center mb-2" role="listitem">
    <span>{description}</span>
    <div className="flex gap-1">
      {keys.map((key, index) => (
        <kbd key={index} className="px-2 py-1 bg-muted rounded text-xs font-semibold">
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" role="dialog" aria-labelledby="pdf-shortcuts-title" aria-describedby="pdf-shortcuts-description">
        <DialogHeader>
          <DialogTitle id="pdf-shortcuts-title">Keyboard Shortcuts</DialogTitle>
          <DialogDescription id="pdf-shortcuts-description">
            Use these keyboard shortcuts to navigate and interact with PDF documents more efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4" role="main">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Navigation</h3>
            <div role="list" aria-label="Navigation shortcuts">
              <ShortcutItem keys={["←"]} description="Previous page" />
              <ShortcutItem keys={["→"]} description="Next page" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Zoom</h3>
            <div role="list" aria-label="Zoom shortcuts">
              <ShortcutItem keys={["Ctrl", "+"]} description="Zoom in" />
              <ShortcutItem keys={["Ctrl", "-"]} description="Zoom out" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Document</h3>
            <div role="list" aria-label="Document shortcuts">
              <ShortcutItem keys={["R"]} description="Rotate document" />
              <ShortcutItem keys={["H"]} description="Toggle highlight mode" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
