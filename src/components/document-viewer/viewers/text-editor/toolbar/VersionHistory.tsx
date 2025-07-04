
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, RotateCcw, Save } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatDistanceToNow } from 'date-fns';

interface DocumentVersion {
  id: string;
  content: string;
  timestamp: Date;
  title: string;
  wordCount: number;
  isAutoSaved: boolean;
}

interface VersionHistoryProps {
  editor: Editor;
  documentTitle: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);

  // Load versions from localStorage
  useEffect(() => {
    const savedVersions = localStorage.getItem(`document_versions_${documentTitle}`);
    if (savedVersions) {
      try {
        const parsedVersions = JSON.parse(savedVersions).map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp)
        }));
        setVersions(parsedVersions);
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    }
  }, [documentTitle]);

  // Save versions to localStorage
  const saveVersions = (newVersions: DocumentVersion[]) => {
    localStorage.setItem(`document_versions_${documentTitle}`, JSON.stringify(newVersions));
    setVersions(newVersions);
  };

  // Create a new version
  const createVersion = (isAutoSave = false) => {
    const content = editor.getHTML();
    const text = editor.getText();
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    const newVersion: DocumentVersion = {
      id: `version_${Date.now()}`,
      content,
      timestamp: new Date(),
      title: isAutoSave ? 'Auto-saved' : 'Manual save',
      wordCount,
      isAutoSaved: isAutoSave
    };

    const updatedVersions = [newVersion, ...versions.slice(0, 19)]; // Keep last 20 versions
    saveVersions(updatedVersions);
  };

  // Restore a version
  const restoreVersion = (version: DocumentVersion) => {
    editor.commands.setContent(version.content);
    setIsOpen(false);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentContent = editor.getHTML();
      const lastVersion = versions[0];
      
      // Only auto-save if content has changed
      if (!lastVersion || lastVersion.content !== currentContent) {
        createVersion(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [editor, versions]);

  const getVersionIcon = (version: DocumentVersion) => {
    return version.isAutoSaved ? (
      <div className="h-2 w-2 rounded-full bg-blue-500" />
    ) : (
      <Save className="h-3 w-3 text-green-500" />
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Version history"
        >
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            Manage document versions and restore previous states
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <Button 
            onClick={() => createVersion(false)} 
            className="w-full"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Create Save Point
          </Button>
          
          {versions.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                No saved versions yet. Create a save point to get started.
              </p>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <Card key={version.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {getVersionIcon(version)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {version.title}
                            </span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {version.wordCount} words
                          </div>
                        </div>
                      </div>
                      
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => restoreVersion(version)}
                          className="h-6 w-6 p-0 ml-2"
                          title="Restore this version"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Content preview */}
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <div className="line-clamp-3 font-mono">
                        {editor.getText().substring(0, 100)}...
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
