
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const useDocumentViewer = () => {
  const [url, setUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setUrl("");
    setSelectedFile(null);
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
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        allowTaint: true,
        foreignObjectRendering: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      
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

  return {
    url,
    setUrl,
    selectedFile,
    setSelectedFile,
    fileInputRef,
    documentRef,
    handleUpload,
    handleDelete,
    handleDownload,
  };
};
