import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useDocumentViewer = () => {
  const [url, setUrl] = useState<string>("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDownload = (file: File | null) => {
    if (!file) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    });
  };

  return {
    url,
    setUrl,
    fileInputRef,
    handleUpload,
    handleDelete,
    handleDownload
  };
};