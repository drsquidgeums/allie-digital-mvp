
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Eye, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface PrintPreviewProps {
  editor: Editor;
  documentTitle: string;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ editor, documentTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDocumentContent = () => {
    return editor.getHTML();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = getDocumentContent();
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print - ${documentTitle}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 1in;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #333;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              h1 { font-size: 2em; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              p { margin-bottom: 1em; }
              ul, ol { margin-bottom: 1em; padding-left: 2em; }
              li { margin-bottom: 0.25em; }
              blockquote {
                border-left: 4px solid #ddd;
                margin: 1em 0;
                padding-left: 1em;
                color: #666;
              }
              code {
                background: #f5f5f5;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
              }
              .highlight {
                background-color: #ffeb3b;
                padding: 0.1em 0.2em;
              }
              @media print {
                body { margin: 0; padding: 0.5in; }
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            <hr style="margin-bottom: 2em;">
            ${content}
          </body>
        </html>
      `;
      
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const content = getDocumentContent();
      const printHTML = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 8.5in; margin: 0 auto; padding: 1in;">
          <h1 style="color: #333; margin-bottom: 1em;">${documentTitle}</h1>
          <hr style="margin-bottom: 2em;">
          ${content}
        </div>
      `;
      
      // Create a blob with the HTML content
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { margin: 0; padding: 20px; }
              h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 1.5em; margin-bottom: 0.5em; }
              p { margin-bottom: 1em; }
              .highlight { background-color: #ffeb3b; padding: 0.1em 0.2em; }
            </style>
          </head>
          <body>${printHTML}</body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentTitle.replace(/[^a-z0-9]/gi, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Print preview"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Print Preview - {documentTitle}
          </DialogTitle>
          <DialogDescription>
            Preview how your document will look when printed
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Document
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download HTML
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 max-h-[60vh] border rounded-lg">
          <Card className="m-4 p-8 bg-white text-black shadow-sm">
            <div className="max-w-none">
              <h1 className="text-2xl font-bold mb-4 text-center border-b pb-4">
                {documentTitle}
              </h1>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: getDocumentContent() }}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  lineHeight: '1.6',
                  color: '#333'
                }}
              />
            </div>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
