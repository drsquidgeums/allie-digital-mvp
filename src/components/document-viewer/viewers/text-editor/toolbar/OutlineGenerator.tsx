
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { List, ChevronRight, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OutlineGeneratorProps {
  editor: Editor;
}

interface OutlineItem {
  id: string;
  level: number;
  text: string;
  position: number;
}

export const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    const generateOutline = () => {
      const doc = editor.state.doc;
      const headings: OutlineItem[] = [];

      doc.descendants((node, pos) => {
        if (node.type.name === 'heading' && node.attrs.level) {
          const level = node.attrs.level;
          const text = node.textContent;
          
          if (text.trim()) {
            headings.push({
              id: `heading-${pos}`,
              level,
              text: text.trim(),
              position: pos
            });
          }
        }
      });

      setOutline(headings);
    };

    generateOutline();

    const handleUpdate = () => generateOutline();
    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, isOpen]);

  const scrollToHeading = (position: number) => {
    // Use TipTap's proper selection API
    const { tr, doc } = editor.state;
    const resolvedPos = doc.resolve(position);
    
    // Create a text selection at the heading position
    editor.chain().focus().setTextSelection(position).run();
    
    // Scroll the heading into view using DOM methods
    setTimeout(() => {
      try {
        // Get the DOM node at the position
        const domAtPos = editor.view.domAtPos(position);
        const element = domAtPos.node;
        
        // Find the heading element by traversing up
        let headingElement = element as Element;
        if (element.nodeType === Node.TEXT_NODE) {
          headingElement = element.parentElement as Element;
        }
        
        // Look for the actual heading element
        while (headingElement && !headingElement.tagName?.match(/^H[1-6]$/)) {
          headingElement = headingElement.parentElement as Element;
          if (!headingElement) break;
        }
        
        if (headingElement) {
          headingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (error) {
        console.warn('Could not scroll to heading:', error);
      }
    }, 100);
    
    setIsOpen(false);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getIndentLevel = (level: number) => {
    return `${(level - 1) * 1.5}rem`;
  };

  const hasChildren = (item: OutlineItem, index: number) => {
    return index < outline.length - 1 && outline[index + 1].level > item.level;
  };

  const shouldShowItem = (item: OutlineItem, index: number) => {
    if (item.level === 1) return true;
    
    // Find the parent heading
    for (let i = index - 1; i >= 0; i--) {
      const parentItem = outline[i];
      if (parentItem.level < item.level) {
        return expandedItems.has(parentItem.id);
      }
    }
    
    return false;
  };

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
                aria-label="Document outline"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Document Outline</TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>Document Outline</DialogTitle>
          <DialogDescription>
            Navigate through your document headings
          </DialogDescription>
        </DialogHeader>
        
        {outline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No headings found in your document.</p>
            <p className="text-sm mt-2">Add headings to see the outline here.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {outline.map((item, index) => {
                if (!shouldShowItem(item, index)) return null;
                
                const hasChildItems = hasChildren(item, index);
                const isExpanded = expandedItems.has(item.id);
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center group hover:bg-accent/50 rounded-md"
                    style={{ paddingLeft: getIndentLevel(item.level) }}
                  >
                    {hasChildItems && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 mr-1"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                    {!hasChildItems && <div className="w-7" />}
                    
                    <button
                      className="flex-1 text-left py-1 px-2 text-sm hover:text-primary transition-colors truncate"
                      onClick={() => scrollToHeading(item.position)}
                      title={item.text}
                    >
                      <span className={`font-${item.level === 1 ? 'semibold' : 'medium'}`}>
                        {item.text}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
