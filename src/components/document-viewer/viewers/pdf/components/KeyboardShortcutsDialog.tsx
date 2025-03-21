
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the PDF document.
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Navigation</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Right Arrow / Page Down</div>
              <div>Next page</div>
              
              <div className="font-medium">Left Arrow / Page Up</div>
              <div>Previous page</div>
              
              <div className="font-medium">Home</div>
              <div>First page</div>
              
              <div className="font-medium">End</div>
              <div>Last page</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Zoom</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Ctrl + +</div>
              <div>Zoom in</div>
              
              <div className="font-medium">Ctrl + -</div>
              <div>Zoom out</div>
              
              <div className="font-medium">Ctrl + 0</div>
              <div>Reset zoom</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Highlights</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Tab</div>
              <div>Next highlight</div>
              
              <div className="font-medium">Shift + Tab</div>
              <div>Previous highlight</div>
              
              <div className="font-medium">Delete / Backspace</div>
              <div>Remove selected highlight</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
