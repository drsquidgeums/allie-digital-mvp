
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, File, Hash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface EnhancedExportMenuProps {
  editor: Editor;
  documentTitle: string;
}

export const EnhancedExportMenu: React.FC<EnhancedExportMenuProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const { toast } = useToast();

  const generateFileName = (title: string, extension: string) => {
    const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    return `${cleanTitle}_${timestamp}.${extension}`;
  };

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertHtmlToMarkdown = (html: string): string => {
    // Simple HTML to Markdown conversion
    let markdown = html
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
      // Bold and Italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      // Paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      // Line breaks
      .replace(/<br[^>]*>/gi, '\n')
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return markdown;
  };

  const exportAsMarkdown = () => {
    const html = editor.getHTML();
    const markdown = convertHtmlToMarkdown(html);
    const fileName = generateFileName(documentTitle, 'md');
    triggerDownload(markdown, fileName, 'text/markdown');
    
    toast({
      title: "Document Exported",
      description: "Markdown file has been downloaded",
    });
  };

  const exportAsHtml = () => {
    const content = editor.getHTML();
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentTitle}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 2rem; margin-bottom: 1rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        blockquote { border-left: 4px solid #ddd; margin: 1rem 0; padding-left: 1rem; color: #666; }
        code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Courier New', monospace; }
        pre { background: #f5f5f5; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    
    const fileName = generateFileName(documentTitle, 'html');
    triggerDownload(htmlDocument, fileName, 'text/html');
    
    toast({
      title: "Document Exported",
      description: "HTML file has been downloaded",
    });
  };

  const exportAsPlainText = () => {
    const text = editor.getText();
    const fileName = generateFileName(documentTitle, 'txt');
    triggerDownload(text, fileName, 'text/plain');
    
    toast({
      title: "Document Exported",
      description: "Text file has been downloaded",
    });
  };

  const exportAsWord = () => {
    const content = editor.getHTML();
    // Simple HTML structure that can be opened by Word
    const wordDocument = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word 15">
<meta name="Originator" content="Microsoft Word 15">
<title>${documentTitle}</title>
<style>
body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.2; }
h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; }
h2 { font-size: 16pt; font-weight: bold; margin-bottom: 10pt; }
h3 { font-size: 14pt; font-weight: bold; margin-bottom: 8pt; }
p { margin-bottom: 10pt; }
</style>
</head>
<body>
${content}
</body>
</html>`;
    
    const fileName = generateFileName(documentTitle, 'doc');
    triggerDownload(wordDocument, fileName, 'application/msword');
    
    toast({
      title: "Document Exported",
      description: "Word document has been downloaded",
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={exportAsWord} className="cursor-pointer">
          <File className="h-4 w-4 mr-2" />
          Export as Word (.doc)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsHtml} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown} className="cursor-pointer">
          <Hash className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAsPlainText} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as Plain Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
