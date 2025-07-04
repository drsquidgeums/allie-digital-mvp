
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FolderOpen, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DocumentSection {
  id: string;
  title: string;
  level: number;
  isCollapsed: boolean;
  content: string;
}

interface DocumentSectionsProps {
  editor: Editor;
}

export const DocumentSections: React.FC<DocumentSectionsProps> = ({ editor }) => {
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    const updateSections = () => {
      const doc = editor.getJSON();
      const extractedSections: DocumentSection[] = [];
      
      const extractSections = (content: any[]) => {
        content.forEach((node: any, index: number) => {
          if (node.type === 'heading' && node.content) {
            const title = node.content
              .filter((item: any) => item.type === 'text')
              .map((item: any) => item.text)
              .join('');
            
            if (title.trim()) {
              extractedSections.push({
                id: `section-${index}`,
                title: title.trim(),
                level: node.attrs.level,
                isCollapsed: false,
                content: ''
              });
            }
          }
        });
      };
      
      if (doc.content) {
        extractSections(doc.content);
      }
      
      setSections(extractedSections);
    };

    updateSections();
    editor.on('update', updateSections);

    return () => {
      editor.off('update', updateSections);
    };
  }, [editor]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isCollapsed: !section.isCollapsed }
          : section
      )
    );
  };

  const addNewSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const sectionHtml = `<h2>${newSectionTitle}</h2><p>Start writing your content here...</p>`;
    editor.chain().focus().insertContent(sectionHtml).run();
    
    setNewSectionTitle('');
    setIsOpen(false);
  };

  const jumpToSection = (section: DocumentSection) => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const targetElement = Array.from(headingElements).find(el => 
      el.textContent?.trim() === section.title
    );
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      editor.commands.focus();
    }
    
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Document sections"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Document Sections</h3>
            <div className="flex gap-2">
              <Input
                placeholder="New section title"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewSection()}
                className="flex-1"
              />
              <Button size="sm" onClick={addNewSection} disabled={!newSectionTitle.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="p-2">
              {sections.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">
                  No sections found. Add headings or create new sections.
                </p>
              ) : (
                <div className="space-y-1">
                  {sections.map(section => (
                    <Collapsible
                      key={section.id}
                      open={!section.isCollapsed}
                      onOpenChange={() => toggleSection(section.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className="w-full flex items-center justify-between p-2 text-sm hover:bg-accent rounded transition-colors"
                          style={{ paddingLeft: `${0.5 + (section.level - 1) * 0.75}rem` }}
                        >
                          <span className="flex items-center">
                            {section.isCollapsed ? (
                              <ChevronRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            )}
                            {section.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            H{section.level}
                          </span>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-6 p-2 text-xs text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSection(section)}
                            className="text-xs h-6"
                          >
                            Jump to section
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
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
