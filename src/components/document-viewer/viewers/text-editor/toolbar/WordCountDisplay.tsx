
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface WordCountDisplayProps {
  editor: Editor;
}

export const WordCountDisplay: React.FC<WordCountDisplayProps> = ({ editor }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      
      setWordCount(words);
      setCharCount(chars);
    };

    updateCounts();

    editor.on('update', updateCounts);

    return () => {
      editor.off('update', updateCounts);
    };
  }, [editor]);

  return (
    <div className="text-xs text-muted-foreground px-2 py-1 border-l">
      <span className="mr-2">{wordCount} words</span>
      <span>{charCount} chars</span>
    </div>
  );
};
