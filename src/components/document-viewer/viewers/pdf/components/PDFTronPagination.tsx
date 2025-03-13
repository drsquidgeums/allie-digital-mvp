
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFTronPaginationProps {
  instance: any;
}

export const PDFTronPagination: React.FC<PDFTronPaginationProps> = ({
  instance
}) => {
  if (!instance) return null;
  
  const { Core } = instance;
  const documentViewer = Core.documentViewer;
  
  const handlePreviousPage = () => {
    documentViewer.previousPage();
  };
  
  const handleNextPage = () => {
    documentViewer.nextPage();
  };
  
  const currentPage = documentViewer.getCurrentPage();
  const pageCount = documentViewer.getPageCount();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
        title="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>
      
      <span className="text-xs">
        Page {currentPage} of {pageCount}
      </span>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleNextPage}
        disabled={currentPage >= pageCount}
        title="Next page"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
