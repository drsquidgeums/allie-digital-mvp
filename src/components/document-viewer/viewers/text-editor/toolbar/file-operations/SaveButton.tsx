
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileManager } from '@/hooks/file-manager';

interface SaveButtonProps {
  editor: Editor;
  documentTitle: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ editor, documentTitle }) => {
  const { toast } = useToast();
  const { uploadFile, updateFile, files } = useFileManager();

  const saveToMyFiles = async () => {
    try {
      // Get the document content as HTML to preserve formatting
      const content = editor.getHTML();
      
      // Create clean display name (without extension)
      const displayName = documentTitle.replace(/\.(html|doc|docx|txt)$/i, '');
      
      // Create filename with .html extension for storage to preserve formatting
      const fileName = `${displayName}.html`;
      
      // Check if we're updating an existing file
      const selectedFileId = sessionStorage.getItem('selectedFileId');
      const selectedFileName = sessionStorage.getItem('selectedFileName');
      
      let existingFile = null;
      
      // First check if we have a file ID in session storage
      if (selectedFileId) {
        existingFile = files.find(file => file.id === selectedFileId);
      }
      
      // If no file found by ID, try to match by display name
      if (!existingFile && selectedFileName) {
        existingFile = files.find(file => {
          const fileDisplayName = file.displayName || file.name.replace(/\.(html|doc|docx|txt)$/i, '');
          return fileDisplayName === selectedFileName.replace(/\.(html|doc|docx|txt)$/i, '');
        });
      }
      
      // If still no file found, try to match by current document title
      if (!existingFile) {
        existingFile = files.find(file => {
          const fileDisplayName = file.displayName || file.name.replace(/\.(html|doc|docx|txt)$/i, '');
          return fileDisplayName === displayName;
        });
      }

      // Create the file object with HTML content to preserve formatting
      const file = new File([content], fileName, { 
        type: 'text/html' 
      });

      if (existingFile) {
        console.log('Updating existing file:', existingFile.displayName || existingFile.name, 'with ID:', existingFile.id);
        
        // Update existing file - this will now preserve the filename structure
        const updatedFile = await updateFile(existingFile, file, {
          originalName: displayName
        });
        
        if (updatedFile) {
          // Update session storage with clean names
          sessionStorage.setItem('selectedFileId', updatedFile.id);
          sessionStorage.setItem('selectedFileName', displayName);
          if (updatedFile.url) {
            sessionStorage.setItem('selectedFileUrl', updatedFile.url);
          }
        }
        
        toast({
          title: "Document Updated",
          description: `"${displayName}" has been updated successfully`,
        });
      } else {
        console.log('Creating new file:', displayName);
        
        // Create new file with proper metadata
        const metadata = {
          originalName: displayName
        };
        
        const newFile = await uploadFile(file, metadata);
        
        // Update sessionStorage with clean names
        if (newFile) {
          sessionStorage.setItem('selectedFileId', newFile.id);
          sessionStorage.setItem('selectedFileName', displayName);
          if (newFile.url) {
            sessionStorage.setItem('selectedFileUrl', newFile.url);
          }
        }
        
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
