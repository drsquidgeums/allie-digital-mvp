
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    <span className="text-sm">{description}</span>
    <div className="flex gap-1" role="group" aria-label={`Keyboard shortcut: ${keys.join(' + ')}`}>
      {keys.map((key, index) => (
        <kbd 
          key={index} 
          className="px-2 py-1 bg-muted rounded text-xs font-semibold"
          aria-label={key}
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md" 
        role="dialog" 
        aria-labelledby="pdf-shortcuts-title" 
        aria-describedby="pdf-shortcuts-description"
      >
        <DialogHeader>
          <DialogTitle id="pdf-shortcuts-title">
            PDF Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription id="pdf-shortcuts-description">
            Use these keyboard shortcuts to navigate and interact with PDF documents more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4" role="main">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Navigation</h3>
            <div role="list" aria-label="Navigation shortcuts">
              <ShortcutItem keys={["←", "Left Arrow"]} description="Previous page" />
              <ShortcutItem keys={["→", "Right Arrow"]} description="Next page" />
              <ShortcutItem keys={["Home"]} description="First page" />
              <ShortcutItem keys={["End"]} description="Last page" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Zoom</h3>
            <div role="list" aria-label="Zoom shortcuts">
              <ShortcutItem keys={["Ctrl", "+"]} description="Zoom in" />
              <ShortcutItem keys={["Ctrl", "-"]} description="Zoom out" />
              <ShortcutItem keys={["Ctrl", "0"]} description="Reset zoom" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Document Actions</h3>
            <div role="list" aria-label="Document shortcuts">
              <ShortcutItem keys={["R"]} description="Rotate document" />
              <ShortcutItem keys={["H"]} description="Toggle highlight mode" />
              <ShortcutItem keys={["Esc"]} description="Exit highlight mode" />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            aria-label="Close keyboard shortcuts dialog"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
