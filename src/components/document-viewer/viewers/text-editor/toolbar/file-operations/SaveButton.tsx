
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
  const { uploadFile, files } = useFileManager();

  const saveToMyFiles = async () => {
    try {
      // Get the document content
      const content = editor.getHTML();
      
      // Create display name (without extension)
      const displayName = documentTitle.replace(/\.(html|doc|docx|txt)$/i, '');
      
      // Create filename with .html extension for storage
      const fileName = generateFileName(documentTitle, 'html');
      
      // Check if a file with the same display name already exists
      const existingFile = files.find(file => 
        (file.displayName || file.name) === displayName ||
        file.name === fileName
      );

      if (existingFile) {
        // Update existing file by creating a new version with the same display name
        const file = new File([content], fileName, { 
          type: 'text/html' 
        });
        
        // Add metadata to preserve the original display name
        const metadata = {
          originalName: displayName,
          isUpdate: true
        };
        
        // Upload as new version (this will replace the existing file in practice)
        await uploadFile(file, metadata);
        
        toast({
          title: "Document Updated",
          description: `"${displayName}" has been updated in My Files`,
        });
      } else {
        // Create new file
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
      }
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
