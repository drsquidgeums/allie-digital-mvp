import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const useDocumentViewer = () => {
  const [url, setUrl] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "File deleted",
      description: "The document has been removed from the viewer",
    });
  };

  const handleDownload = async (file: File | null) => {
    if (!file || !documentRef.current) {
      toast({
        title: "Error",
        description: "No document to download",
        variant: "destructive",
      });
      return;
    }

    try {
      // Capture the document with annotations as canvas
      const canvas = await html2canvas(documentRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });

      // Convert to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      
      // Download with original filename but append "_annotated"
      const fileName = file.name.replace(/\.[^/.]+$/, "") + "_annotated.pdf";
      pdf.save(fileName);

      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your document",
        variant: "destructive",
      });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  return {
    url,
    setUrl,
    zoom,
    fileInputRef,
    documentRef,
    handleUpload,
    handleDelete,
    handleDownload,
    handleZoomIn,
    handleZoomOut
  };
};