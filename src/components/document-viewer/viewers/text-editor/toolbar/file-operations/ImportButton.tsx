
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { extractTextFromFile } from '../../../../FileConverter';

interface ImportButtonProps {
  onFileImport: (content: string) => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ onFileImport }) => {
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
  );
};
