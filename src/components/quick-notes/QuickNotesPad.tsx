
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { StickyNote, X, Minimize2, Maximize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const STORAGE_KEY = 'quick_notes_content';
const VISIBILITY_KEY = 'quick_notes_visible';

export const QuickNotesPad: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContent(saved);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Open Quick Notes"
            >
              <StickyNote className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Quick Notes (Alt+N)</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 bg-card border border-border rounded-lg shadow-xl transition-all ${isMinimized ? 'w-64' : 'w-80'}`}>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Quick Notes</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand' : 'Minimise'}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
            aria-label="Close Quick Notes"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {!isMinimized && (
        <div className="p-3">
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Jot down quick thoughts here... They'll be saved automatically."
            className="w-full h-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
            aria-label="Quick notes text area"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">Auto-saved</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => { setContent(''); localStorage.removeItem(STORAGE_KEY); }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
