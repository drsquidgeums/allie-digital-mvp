
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeadingNavItem {
  id: string;
  level: number;
  text: string;
  position: number;
  isActive: boolean;
}

interface HeadingNavigationProps {
  editor: Editor;
}

export const HeadingNavigation: React.FC<HeadingNavigationProps> = ({ editor }) => {
  const [headings, setHeadings] = useState<HeadingNavItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateHeadings = () => {
      const doc = editor.getJSON();
      const extractedHeadings: HeadingNavItem[] = [];
      
      const extractHeadings = (content: Record<string, unknown>[], startPos = 0) => {
        let position = startPos;
        
        content.forEach((node: Record<string, unknown>) => {
          if (node.type === 'heading' && Array.isArray(node.content)) {
            const text = (node.content as Record<string, unknown>[])
              .filter((item) => item.type === 'text')
              .map((item) => item.text as string)
              .join('');
            
            if (text.trim()) {
              extractedHeadings.push({
                id: `nav-heading-${extractedHeadings.length}`,
                level: (node.attrs as Record<string, unknown>)?.level as number,
                text: text.trim(),
                position,
                isActive: false
              });
            }
          }
          
          if (Array.isArray(node.content)) {
            extractHeadings(node.content as Record<string, unknown>[], position);
          }
          
          position++;
        });
      };
      
      if (doc.content) {
        extractHeadings(doc.content);
      }
      
      setHeadings(extractedHeadings);
    };

    updateHeadings();
    editor.on('update', updateHeadings);

    return () => {
      editor.off('update', updateHeadings);
    };
  }, [editor]);

  const navigateToHeading = (heading: HeadingNavItem) => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const targetElement = Array.from(headingElements).find(el => 
      el.textContent?.trim() === heading.text
    );
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      editor.commands.focus();
      setActiveHeading(heading.id);
    }
  };

  const getHeadingIcon = (level: number) => {
    const size = Math.max(8, 16 - level);
    return <MapPin className={`h-${size/4} w-${size/4}`} />;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Document navigation"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Document Navigation</SheetTitle>
          <SheetDescription>
            Jump to any heading in your document
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {headings.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                No headings found. Add headings to see navigation.
              </p>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-1">
                {headings.map(heading => (
                  <button
                    key={heading.id}
                    onClick={() => navigateToHeading(heading)}
                    className={`w-full flex items-start gap-2 p-3 text-left text-sm hover:bg-accent rounded-lg transition-colors ${
                      activeHeading === heading.id ? 'bg-accent' : ''
                    }`}
                    style={{ paddingLeft: `${0.75 + (heading.level - 1) * 0.75}rem` }}
                  >
                    {getHeadingIcon(heading.level)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{heading.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Heading {heading.level}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
