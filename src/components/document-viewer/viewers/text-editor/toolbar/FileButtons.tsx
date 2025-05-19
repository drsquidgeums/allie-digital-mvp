
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown } from 'lucide-react';
import { extractTextFromFile } from '../../../FileConverter';

interface FileButtonsProps {
  editor: Editor;
  onFileImport: (content: string) => void;
}

export const FileButtons: React.FC<FileButtonsProps> = ({ 
  editor,
  onFileImport
}) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await extractTextFromFile(file);
      onFileImport(content);
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  return (
    <>
      <div>
        <input
          type="file"
          id="file-upload"
          accept=".txt,.doc,.docx,.pdf,.html"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="h-8 w-8 p-0"
          aria-label="Import Document"
        >
          <FileUp className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const content = editor.getHTML();
          const blob = new Blob([content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.html';
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="h-8 w-8 p-0"
        aria-label="Export Document"
      >
        <FileDown className="h-4 w-4" />
      </Button>
    </>
  );
};
