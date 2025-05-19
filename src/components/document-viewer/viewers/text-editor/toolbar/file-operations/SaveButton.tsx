
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileManager } from '@/hooks/file-manager';
import { generateFileName } from '../utils/fileUtils';

interface SaveButtonProps {
  editor: Editor;
  documentTitle: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ editor, documentTitle }) => {
  const { toast } = useToast();
  const { uploadFile } = useFileManager();

  const saveToMyFiles = async () => {
    try {
      // Get the document content
      const content = editor.getHTML();
      
      // Create filename with .html extension
      const fileName = generateFileName(documentTitle, 'html');
      
      // Create a file object from the HTML content
      const file = new File([content], fileName, { type: 'text/html' });
      
      // Upload to file manager
      await uploadFile(file);
      
      toast({
        title: "Document Saved",
        description: `"${fileName.replace('.html', '')}" saved to My Files`,
      });
    } catch (error) {
      console.error('Error saving document to My Files:', error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving your document",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={saveToMyFiles}
      className="h-8 w-8 p-0"
      aria-label="Save to My Files"
      title="Save to My Files"
    >
      <Save className="h-4 w-4" />
    </Button>
  );
};
