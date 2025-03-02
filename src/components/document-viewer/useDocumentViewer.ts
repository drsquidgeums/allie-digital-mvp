
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * useDocumentViewer Hook
 * 
 * A custom hook that manages document viewer state and operations including:
 * - URL management for viewing web content
 * - File selection state for uploaded documents
 * - Document operations like upload, delete, and download
 * - References to key DOM elements
 * 
 * @returns Object containing state variables and handler functions for the document viewer
 */
export const useDocumentViewer = () => {
  // State management
  const [url, setUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // References to DOM elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  /**
   * Triggers the file input dialog
   */
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  /**
   * Clears the current document from the viewer
   * Resets both URL and file selection, and clears the file input
   */
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

  /**
   * Downloads the current document with annotations
   * Captures the document view as an image and creates a PDF
   * 
   * @param file - The file to download
   */
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
      // Capture the document view as a high-quality canvas
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,             // Higher scale for better quality
        useCORS: true,        // Allow cross-origin images
        logging: false,       // Disable logging for production
        allowTaint: true,     // Allow potentially tainted canvas
        foreignObjectRendering: true  // Render DOM elements directly
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a new PDF with dimensions matching the canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      
      // Generate a filename based on the original file
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
