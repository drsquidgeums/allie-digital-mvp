
import React, { useState, useCallback } from 'react';
import { Highlighter, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export const HighlightsSummary: React.FC = () => {
  const [highlights, setHighlights] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [scanned, setScanned] = useState(false);
  const { toast } = useToast();

  const scanHighlights = useCallback(() => {
    // Query the live TipTap editor DOM for highlighted marks
    const editorEl = document.querySelector('.ProseMirror');
    if (!editorEl) {
      setHighlights([]);
      setScanned(true);
      return;
    }

    const highlightedElements = editorEl.querySelectorAll('mark, [data-color], .highlight, [style*="background-color"]');
    const extracted: string[] = [];

    highlightedElements.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && !extracted.includes(text)) {
        extracted.push(text);
      }
    });

    setHighlights(extracted);
    setScanned(true);
  }, []);

  // Scan on first render
  React.useEffect(() => {
    scanHighlights();
  }, [scanHighlights]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(highlights.join('\n\n'));
      toast({ title: 'All highlights copied!' });
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  if (highlights.length === 0) {
    return (
      <div className="p-4 text-center">
        <Highlighter className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No highlights found</p>
        <p className="text-xs text-muted-foreground mt-1">
          Highlight text in your document to see them collected here for revision
        </p>
        {scanned && (
          <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={scanHighlights}>
            <RefreshCw className="h-3 w-3 mr-1" /> Rescan
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Highlighter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{highlights.length} Highlight{highlights.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={scanHighlights} title="Rescan">
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={copyAll}>
            Copy All
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {highlights.map((text, i) => (
            <div key={i} className="p-3 rounded-md bg-accent/20 border border-accent/30 group relative">
              <p className="text-sm text-foreground pr-6">{text}</p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(text, i)}
              >
                {copiedIndex === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
