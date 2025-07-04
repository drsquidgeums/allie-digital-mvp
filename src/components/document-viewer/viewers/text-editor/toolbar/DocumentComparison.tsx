
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { GitCompare, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DocumentComparisonProps {
  editor: Editor;
  documentTitle: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [compareText, setCompareText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);

  const generateDiff = () => {
    const currentText = editor.getText();
    const compareLines = compareText.split('\n');
    const currentLines = currentText.split('\n');
    
    const diff: DiffLine[] = [];
    const maxLines = Math.max(compareLines.length, currentLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const compareLine = compareLines[i] || '';
      const currentLine = currentLines[i] || '';
      
      if (compareLine === currentLine) {
        diff.push({
          type: 'unchanged',
          content: currentLine,
          lineNumber: i + 1
        });
      } else {
        if (compareLine && !currentLine) {
          diff.push({
            type: 'removed',
            content: compareLine,
            lineNumber: i + 1
          });
        } else if (!compareLine && currentLine) {
          diff.push({
            type: 'added',
            content: currentLine,
            lineNumber: i + 1
          });
        } else {
          diff.push({
            type: 'removed',
            content: compareLine,
            lineNumber: i + 1
          });
          diff.push({
            type: 'added',
            content: currentLine,
            lineNumber: i + 1
          });
        }
      }
    }
    
    setDiffResult(diff);
  };

  const getDiffLineStyle = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500';
      default:
        return 'bg-gray-50 dark:bg-gray-800/20';
    }
  };

  const getDiffLinePrefix = (type: string) => {
    switch (type) {
      case 'added':
        return '+ ';
      case 'removed':
        return '- ';
      default:
        return '  ';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Compare documents"
        >
          <GitCompare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Comparison</DialogTitle>
          <DialogDescription>
            Compare your current document with another version
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Compare with:</h4>
            <Textarea
              placeholder="Paste the text you want to compare with..."
              value={compareText}
              onChange={(e) => setCompareText(e.target.value)}
              className="h-32 text-sm font-mono"
            />
            <Button onClick={generateDiff} className="w-full">
              Generate Comparison
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Current Document: {documentTitle}</h4>
            <ScrollArea className="h-32 border rounded-md p-2 bg-muted/50">
              <pre className="text-xs whitespace-pre-wrap">
                {editor.getText()}
              </pre>
            </ScrollArea>
          </div>
        </div>
        
        {diffResult.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Differences:</h4>
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-1">
                {diffResult.map((line, index) => (
                  <div
                    key={index}
                    className={`p-2 text-xs font-mono rounded ${getDiffLineStyle(line.type)}`}
                  >
                    <span className="inline-block w-8 text-gray-500">
                      {line.lineNumber}
                    </span>
                    <span className="font-semibold">
                      {getDiffLinePrefix(line.type)}
                    </span>
                    {line.content || ' '}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
