
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { StickyNote, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

export const QuickNotesPad: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);

  // Load notes from Supabase on mount
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }

      const { data } = await supabase
        .from('quick_notes')
        .select('content')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) setContent(data.content);
      loadedRef.current = true;
      setIsLoading(false);
    };
    load();
  }, []);

  // Debounced save to Supabase
  const saveToSupabase = useCallback(async (text: string) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('quick_notes')
        .upsert(
          { user_id: user.id, content: text, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
    } catch (e) {
      console.error('Failed to save quick notes:', e);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToSupabase(value), 800);
  };

  const handleClear = async () => {
    setContent('');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await saveToSupabase('');
  };

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-24 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Open Quick Notes"
            >
              <StickyNote className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Quick Notes (Alt+N)</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-24 z-50 bg-card border border-border rounded-lg shadow-xl transition-all ${isMinimized ? 'w-64' : 'w-80'}`}>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="Jot down quick thoughts here... They'll be saved automatically."
              className="w-full h-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
              aria-label="Quick notes text area"
            />
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {isSaving ? 'Saving...' : 'Saved to your account'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
