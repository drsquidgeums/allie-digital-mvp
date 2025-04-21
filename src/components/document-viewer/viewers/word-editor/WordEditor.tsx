
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileManager } from '@/hooks/useFileManager';

interface WordEditorProps {
  file: File | null;
  url: string;
  initialContent?: string;
  onSave?: (content: string, fileName: string) => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  file,
  url,
  initialContent = '',
  onSave
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState(file?.name || 'Untitled Document.docx');
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { uploadFile } = useFileManager();

  useEffect(() => {
    // Load content from file if provided
    const loadContent = async () => {
      if (file) {
        setIsLoading(true);
        try {
          setFileName(file.name);
          
          // For text files
          if (file.type.includes('text')) {
            const text = await file.text();
            setContent(text);
          } 
          // For other formats, display message about limited editing
          else {
            setContent(`<p>Viewing ${file.name}</p><p>Note: Full editing capabilities for ${file.type} files are in development.</p>`);
            
            toast({
              title: "Limited editing mode",
              description: `${file.type} files currently have limited editing capabilities.`,
            });
          }
        } catch (error) {
          console.error("Error loading file:", error);
          toast({
            variant: "destructive",
            title: "Error loading file",
            description: "There was a problem loading this file for editing."
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (file) {
      loadContent();
    }
  }, [file, toast]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    const htmlContent = editorRef.current.innerHTML;
    
    // Create a new Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const htmlFile = new File([blob], fileName.replace(/\.\w+$/, '.html'), { type: 'text/html' });
    
    try {
      // Upload to storage
      const savedFile = await uploadFile(htmlFile);
      
      toast({
        title: "Document saved",
        description: `${fileName} has been saved to My Files`,
      });
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(htmlContent, fileName);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your document."
      });
    }
  };

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex flex-wrap gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('bold')}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('italic')}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('underline')}
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 border-r border-border mx-1"></div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('justifyLeft')}
          aria-label="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('justifyCenter')}
          aria-label="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => formatText('justifyRight')}
          aria-label="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="flex-1"></div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
          className="ml-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      
      {/* Document title/filename */}
      <div className="flex items-center p-2">
        <input 
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border-none bg-transparent text-lg font-medium focus:outline-none focus:ring-0 w-full"
        />
      </div>
      
      {/* Editor */}
      <div 
        className="flex-1 p-4 overflow-auto"
        style={{ 
          backgroundColor: "white", 
          color: "black",
          minHeight: "200px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          className="h-full p-6 focus:outline-none"
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          style={{ 
            minHeight: "100%",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.5"
          }}
        />
      </div>
    </div>
  );
};

export default WordEditor;
