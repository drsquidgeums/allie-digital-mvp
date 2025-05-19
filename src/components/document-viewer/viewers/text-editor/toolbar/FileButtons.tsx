
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, Save } from 'lucide-react';
import { extractTextFromFile } from '../../../FileConverter';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { htmlToPlainText } from '../textFormatUtils';
import { useToast } from '@/hooks/use-toast';
import { useFileManager } from '@/hooks/file-manager';

interface FileButtonsProps {
  editor: Editor;
  onFileImport: (content: string) => void;
  documentTitle?: string;
}

export const FileButtons: React.FC<FileButtonsProps> = ({ 
  editor,
  onFileImport,
  documentTitle = 'Untitled Document'
}) => {
  const { toast } = useToast();
  const { uploadFile } = useFileManager();
  
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

  const downloadAsHtml = () => {
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/\.(html|doc|docx|txt)$/i, '')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Downloaded",
      description: "Document saved as HTML file",
    });
  };

  const downloadAsDoc = () => {
    // Create a basic .doc file with HTML content
    // This creates a simple .doc file that Word can open
    const content = editor.getHTML();
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${documentTitle}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          /* Add some basic styling */
          body {
            font-family: 'Calibri', sans-serif;
            font-size: 11pt;
          }
          p {
            margin: 0;
            padding: 0;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
    `;
    
    const footer = `
      </body>
      </html>
    `;
    
    const fullContent = header + content + footer;
    
    // Create and download the file
    const blob = new Blob([fullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/\.(html|doc|docx|txt)$/i, '')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Downloaded",
      description: "Document saved as Word (.doc) file",
    });
  };
  
  const saveToMyFiles = async () => {
    try {
      // Get the document content
      const content = editor.getHTML();
      
      // Use document title for the file name
      const fileName = documentTitle === 'Untitled Document'
        ? `document_${new Date().toISOString().slice(0, 10)}.html`
        : `${documentTitle.replace(/\.(html|doc|docx|txt)$/i, '')}.html`;
      
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
        onClick={saveToMyFiles}
        className="h-8 w-8 p-0"
        aria-label="Save to My Files"
        title="Save to My Files"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Export Document"
          >
            <FileDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 dark:bg-[#333333] dark:border dark:border-white/20 dark:text-[#FAFAFA]">
          <DropdownMenuItem onClick={downloadAsDoc} className="dark:hover:bg-[#444444] dark:focus:bg-[#444444] cursor-pointer">
            Download as Word (.doc)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsHtml} className="dark:hover:bg-[#444444] dark:focus:bg-[#444444] cursor-pointer">
            Download as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
