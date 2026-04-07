
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface ShortcutCategory {
  category: string;
  shortcuts: { keys: string[]; description: string }[];
}

interface GlobalKeyboardShortcutsProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export const GlobalKeyboardShortcuts: React.FC<GlobalKeyboardShortcutsProps> = ({
  externalOpen,
  onExternalOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { t } = useTranslation();

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onExternalOpenChange?.(v)
    : setInternalOpen;

  const categories: ShortcutCategory[] = [
    {
      category: 'Navigation',
      shortcuts: [
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Toggle Focus Mode' },
        { keys: ['Ctrl', 'Shift', 'P'], description: 'Start Pomodoro Timer' },
        { keys: ['Esc'], description: 'Close any open panel' },
      ],
    },
    {
      category: 'Reading Tools',
      shortcuts: [
        { keys: ['Alt', 'B'], description: 'Toggle Bionic Reader' },
        { keys: ['Alt', 'L'], description: 'Toggle Beeline Reader' },
        { keys: ['Alt', 'T'], description: 'Toggle Text to Speech' },
      ],
    },
    {
      category: 'Document',
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Save document' },
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Y'], description: 'Redo' },
        { keys: ['Ctrl', 'F'], description: 'Find in document' },
      ],
    },
    {
      category: 'Quick Notes',
      shortcuts: [
        { keys: ['Alt', 'N'], description: 'Toggle Quick Notes' },
      ],
    },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInFormField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    
    // For simple key shortcuts (like ?), ignore if in any editable area
    // For modifier shortcuts (Alt+, Ctrl+Shift+), only ignore in form fields
    const isModifierShortcut = e.altKey || (e.ctrlKey && e.shiftKey);
    if (isInFormField) return;
    if (target.isContentEditable && !isModifierShortcut) return;

    // ? - Toggle shortcuts panel
    if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      if (isControlled) {
        onExternalOpenChange?.(!open);
      } else {
        setInternalOpen(prev => !prev);
      }
      return;
    }

    // Ctrl+Shift+F - Toggle Focus Mode
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('shortcut:toggle-focus-mode'));
      return;
    }

    // Ctrl+Shift+P - Start/Stop Pomodoro Timer
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('shortcut:toggle-pomodoro'));
      return;
    }

    // Alt+B - Toggle Bionic Reader
    if (e.altKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('shortcut:toggle-bionic'));
      return;
    }

    // Alt+L - Toggle Beeline Reader
    if (e.altKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('shortcut:toggle-beeline'));
      return;
    }

    // Alt+T - Toggle Text to Speech
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('shortcut:toggle-tts'));
      return;
    }
  }, [isControlled, onExternalOpenChange, open]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-semibold">?</kbd> anytime to toggle this panel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-sm font-semibold text-primary mb-2">{cat.category}</h3>
              <div className="space-y-1.5">
                {cat.shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between py-1">
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd key={i} className="px-2 py-0.5 bg-muted rounded text-xs font-mono font-semibold border border-border">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> On Mac, use Cmd instead of Ctrl for most shortcuts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
