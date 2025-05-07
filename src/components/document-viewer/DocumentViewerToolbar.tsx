
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, FileText, File } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface DocumentViewerToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

/**
 * DocumentViewerToolbar Component
 * 
 * Provides action buttons for the document viewer
 */
export const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile,
}) => {
  return (
    <div className="py-2 px-4 border-b flex items-center justify-between bg-card text-card-foreground">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Document Viewer</h2>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-muted">
                  <File className="h-3 w-3 mr-1" />
                  PDF
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>PDF files supported</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-muted">
                  <FileText className="h-3 w-3 mr-1" />
                  DOCX
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Word documents supported</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-muted">
                  <FileText className="h-3 w-3 mr-1" />
                  TXT/HTML
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text and HTML files supported</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={onUpload}
                className="flex items-center space-x-1"
                aria-label="Upload document"
              >
                <Upload className="h-4 w-4 mr-1" />
                <span>Upload</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload a document (PDF, DOCX, TXT, HTML)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {hasFile && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    className="flex items-center"
                    aria-label="Download document"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span>Download</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download the current document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="flex items-center text-destructive hover:text-destructive"
                    aria-label="Remove document"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>Remove</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove the current document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
};
