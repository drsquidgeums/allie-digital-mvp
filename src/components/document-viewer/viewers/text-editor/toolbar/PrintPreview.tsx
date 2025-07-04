
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PrintPreviewProps {
  editor: Editor;
  documentTitle: string;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = editor.getHTML();
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 1in;
              color: black;
              background: white;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1em;
              margin-bottom: 0.5em;
            }
            p {
              margin-bottom: 1em;
            }
            ul, ol {
              margin-bottom: 1em;
              padding-left: 2em;
            }
            blockquote {
              margin: 1em 0;
              padding-left: 1em;
              border-left: 3px solid #ccc;
              font-style: italic;
            }
            code {
              background: #f5f5f5;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            pre {
              background: #f5f5f5;
              padding: 1em;
              border-radius: 5px;
              overflow: auto;
            }
            @media print {
              body {
                margin: 0.5in;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>${documentTitle}</h1>
          <div>${content}</div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Print preview"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print Preview</TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Print Preview - {documentTitle}</DialogTitle>
          <DialogDescription>
            Preview how your document will look when printed
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-lg bg-white">
          <div 
            className="p-8 prose prose-sm max-w-none"
            style={{
              fontFamily: '"Times New Roman", serif',
              lineHeight: '1.6',
              minHeight: '11in',
              width: '8.5in',
              margin: '0 auto',
              background: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            <h1 className="text-2xl font-bold mb-6">{documentTitle}</h1>
            <div 
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              className="prose-p:mb-4 prose-headings:mt-6 prose-headings:mb-3"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
