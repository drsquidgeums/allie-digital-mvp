import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { ViewerContainer } from "./document-viewer/ViewerContainer";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ file, selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
  const {
    url,
    setUrl,
    fileInputRef,
    handleUpload,
    handleDelete,
    handleDownload,
    handleZoomIn,
    handleZoomOut
  } = useDocumentViewer();

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setUrl("");
    }
  }, [file, setUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to the viewer`,
      });
    }
  };

  return (
    <>
      <ViewerContainer
        file={file}
        url={url}
        setUrl={setUrl}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onUpload={handleUpload}
        onDownload={() => handleDownload(file)}
        onDelete={handleDelete}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.html"
        onChange={handleFileChange}
      />
    </>
  );
};