
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface WordCountDisplayProps {
  editor: Editor;
}

interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  pages: number;
  readingTime: number;
}

export const WordCountDisplay: React.FC<WordCountDisplayProps> = ({ editor }) => {
  const [stats, setStats] = useState<DocumentStats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    pages: 0,
    readingTime: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0).length;
      const pages = Math.max(1, Math.ceil(words / 250)); // Assuming ~250 words per page
      const readingTime = Math.max(1, Math.ceil(words / 200)); // Assuming ~200 words per minute

      setStats({
        words,
        characters,
        charactersNoSpaces,
        paragraphs,
        pages,
        readingTime
      });
    };

    // Update stats when editor content changes
    const handleUpdate = () => updateStats();
    editor.on('update', handleUpdate);
    
    // Initial calculation
    updateStats();

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-accent/50 gap-1"
          aria-label={`Document statistics: ${stats.words} words`}
        >
          <FileText className="h-3 w-3" />
          {stats.words} words
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-3">Document Statistics</h4>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Words:</span>
              <span className="font-medium">{stats.words.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Characters:</span>
              <span className="font-medium">{stats.characters.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">No spaces:</span>
              <span className="font-medium">{stats.charactersNoSpaces.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paragraphs:</span>
              <span className="font-medium">{stats.paragraphs}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pages:</span>
              <span className="font-medium">{stats.pages}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Read time:</span>
              <span className="font-medium">{stats.readingTime} min</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
