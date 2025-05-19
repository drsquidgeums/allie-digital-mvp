
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
      
      // Create display name (without extension)
      const displayName = documentTitle.replace(/\.(html|doc|docx|txt)$/i, '');
      
      // Create filename with .html extension for storage
      const fileName = generateFileName(documentTitle, 'html');
      
      // Create a file object from the HTML content
      const file = new File([content], fileName, { 
        type: 'text/html' 
      });
      
      // Add metadata for the original display name
      const metadata = {
        originalName: displayName
      };
      
      // Upload to file manager with metadata
      await uploadFile(file, metadata);
      
      toast({
        title: "Document Saved",
        description: `"${displayName}" saved to My Files`,
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
