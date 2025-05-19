
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown } from 'lucide-react';
import { extractTextFromFile } from '../../../FileConverter';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { htmlToPlainText } from '../textFormatUtils';
import { useToast } from '@/hooks/use-toast';

interface FileButtonsProps {
  editor: Editor;
  onFileImport: (content: string) => void;
}

export const FileButtons: React.FC<FileButtonsProps> = ({ 
  editor,
  onFileImport
}) => {
  const { toast } = useToast();
  
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
    a.download = 'document.html';
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
        <title>Document</title>
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
    a.download = 'document.doc';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Downloaded",
      description: "Document saved as Word (.doc) file",
    });
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={downloadAsDoc}>
            Download as Word (.doc)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsHtml}>
            Download as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
