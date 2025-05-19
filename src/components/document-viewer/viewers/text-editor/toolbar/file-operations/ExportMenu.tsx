
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  generateFileName,
  createDocumentHeader,
  createDocumentFooter,
  triggerDownload
} from '../utils/fileUtils';

interface ExportMenuProps {
  editor: Editor;
  documentTitle: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ editor, documentTitle }) => {
  const { toast } = useToast();

  const downloadAsHtml = () => {
    const content = editor.getHTML();
    const fileName = generateFileName(documentTitle, 'html');
    triggerDownload(content, fileName, 'text/html');
    
    toast({
      title: "Document Downloaded",
      description: "Document saved as HTML file",
    });
  };

  const downloadAsDoc = () => {
    const content = editor.getHTML();
    const header = createDocumentHeader(documentTitle);
    const footer = createDocumentFooter();
    const fullContent = header + content + footer;
    
    const fileName = generateFileName(documentTitle, 'doc');
    triggerDownload(fullContent, fileName, 'application/msword');
    
    toast({
      title: "Document Downloaded",
      description: "Document saved as Word (.doc) file",
    });
  };

  return (
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
  );
};
