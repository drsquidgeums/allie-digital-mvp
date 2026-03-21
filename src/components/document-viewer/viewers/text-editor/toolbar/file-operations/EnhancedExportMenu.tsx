
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, File, Hash, FileType, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { exportAsDocx } from './docxExport';
import { exportAsPdf } from './pdfExport';

interface EnhancedExportMenuProps {
  editor: Editor;
  documentTitle: string;
}

export const EnhancedExportMenu: React.FC<EnhancedExportMenuProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

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
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return markdown;
  };

  const exportAsMarkdown = () => {
    const html = editor.getHTML();
    const markdown = convertHtmlToMarkdown(html);
    const fileName = generateFileName(documentTitle, 'md');
    triggerDownload(markdown, fileName, 'text/markdown');
    toast({ title: "Document Exported", description: "Markdown file has been downloaded" });
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
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    const fileName = generateFileName(documentTitle, 'html');
    triggerDownload(htmlDocument, fileName, 'text/html');
    toast({ title: "Document Exported", description: "HTML file has been downloaded" });
  };

  const exportAsPlainText = () => {
    const text = editor.getText();
    const fileName = generateFileName(documentTitle, 'txt');
    triggerDownload(text, fileName, 'text/plain');
    toast({ title: "Document Exported", description: "Text file has been downloaded" });
  };

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      await exportAsDocx(editor.getHTML(), documentTitle);
      toast({ title: "Document Exported", description: "Word (.docx) file has been downloaded, formatting preserved" });
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({ title: "Export Failed", description: "Could not generate Word document", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportAsPdf(editor.getHTML(), documentTitle);
      toast({ title: "Document Exported", description: "PDF file has been downloaded" });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: "Export Failed", description: "Could not generate PDF", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Export Document"
          disabled={exporting}
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportDocx} className="cursor-pointer" disabled={exporting}>
          <File className="h-4 w-4 mr-2" />
          Export as Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer" disabled={exporting}>
          <FileType className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
