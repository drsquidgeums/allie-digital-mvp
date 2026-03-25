
import React, { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
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

    const content = DOMPurify.sanitize(editor.getHTML());
    const safeTitle = documentTitle
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeTitle}</title>
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
          <h1>${safeTitle}</h1>
          <div>${content}</div>
        </body>
      </html>
    `;

    const blob = new Blob([printContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    printFrame.src = blobUrl;
    document.body.appendChild(printFrame);
    
    printFrame.onload = () => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    };
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
      <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Print Preview - {documentTitle}</DialogTitle>
          <DialogDescription>
            Preview how your document will look when printed
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-lg bg-white min-h-0">
          <div 
            className="p-6 sm:p-8 prose prose-sm max-w-none"
            style={{
              fontFamily: '"Times New Roman", serif',
              lineHeight: '1.6',
              minHeight: '400px',
              background: 'white',
            }}
          >
            <h1 className="text-2xl font-bold mb-6 text-black">{documentTitle}</h1>
            <div 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor.getHTML()) }}
              className="prose-p:mb-4 prose-headings:mt-6 prose-headings:mb-3 text-black"
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
