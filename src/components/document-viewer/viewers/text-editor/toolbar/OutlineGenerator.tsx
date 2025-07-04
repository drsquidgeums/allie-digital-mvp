
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { List, Hash } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface OutlineItem {
  id: string;
  level: number;
  text: string;
  position: number;
}

interface OutlineGeneratorProps {
  editor: Editor;
}

export const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ editor }) => {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateOutline = () => {
      const headings: OutlineItem[] = [];
      const doc = editor.getJSON();
      
      const extractHeadings = (content: any[], startPos = 0) => {
        let position = startPos;
        
        content.forEach((node: any) => {
          if (node.type === 'heading' && node.content) {
            const text = node.content
              .filter((item: any) => item.type === 'text')
              .map((item: any) => item.text)
              .join('');
            
            if (text.trim()) {
              headings.push({
                id: `heading-${headings.length}`,
                level: node.attrs.level,
                text: text.trim(),
                position
              });
            }
          }
          
          if (node.content) {
            extractHeadings(node.content, position);
          }
          
          position++;
        });
      };
      
      if (doc.content) {
        extractHeadings(doc.content);
      }
      
      setOutline(headings);
    };

    updateOutline();
    editor.on('update', updateOutline);

    return () => {
      editor.off('update', updateOutline);
    };
  }, [editor]);

  const jumpToHeading = (heading: OutlineItem) => {
    // Find the heading in the document and scroll to it
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const targetElement = Array.from(headingElements).find(el => 
      el.textContent?.trim() === heading.text
    );
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the editor at this position
      editor.commands.focus();
    }
    
    setIsOpen(false);
  };

  const generateTOC = () => {
    if (outline.length === 0) return;

    let tocContent = '<h2>Table of Contents</h2><ul>';
    
    outline.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1);
      tocContent += `${indent}<li><a href="#heading-${heading.id}">${heading.text}</a></li>`;
    });
    
    tocContent += '</ul>';
    
    // Insert TOC at the beginning of the document
    editor.chain().focus().setTextSelection(0).insertContent(tocContent).run();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Document outline"
        >
          <List className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Document Outline</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateTOC}
                disabled={outline.length === 0}
              >
                <Hash className="h-4 w-4 mr-1" />
                Insert TOC
              </Button>
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="p-2">
              {outline.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">
                  No headings found. Add headings to see the document outline.
                </p>
              ) : (
                <div className="space-y-1">
                  {outline.map(heading => (
                    <button
                      key={heading.id}
                      onClick={() => jumpToHeading(heading)}
                      className="w-full text-left p-2 text-sm hover:bg-accent rounded transition-colors"
                      style={{ paddingLeft: `${0.5 + (heading.level - 1) * 0.75}rem` }}
                    >
                      <span className="text-muted-foreground mr-2">
                        H{heading.level}
                      </span>
                      {heading.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
