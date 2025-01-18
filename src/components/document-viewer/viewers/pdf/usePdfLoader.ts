import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from "@/hooks/use-toast";

export const usePdfLoader = (file: File | null, url: string) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        let pdfUrl: string | ArrayBuffer;
        
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfUrl = arrayBuffer;
        } else if (url) {
          pdfUrl = url;
        } else {
          return;
        }

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);

        toast({
          title: "PDF loaded successfully",
          description: `Total pages: ${pdf.numPages}`,
        });
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error loading PDF",
          description: "There was a problem loading the PDF document",
          variant: "destructive",
        });
      }
    };

    loadPDF();
  }, [file, url, toast]);

  return { pdfDoc, numPages };
};