
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Clock, FileText } from 'lucide-react';

interface WordCountDisplayProps {
  editor: Editor;
}

export const WordCountDisplay: React.FC<WordCountDisplayProps> = ({ editor }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      
      // Calculate reading time (average 200 words per minute)
      const estimatedReadingTime = Math.ceil(words / 200);
      
      setWordCount(words);
      setCharCount(chars);
      setReadingTime(estimatedReadingTime);
    };

    updateCounts();

    editor.on('update', updateCounts);

    return () => {
      editor.off('update', updateCounts);
    };
  }, [editor]);

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground px-2 py-1 border-l">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span>{wordCount} words</span>
      </div>
      <div className="flex items-center gap-1">
        <span>{charCount} chars</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};
