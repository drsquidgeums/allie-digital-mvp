import React from "react";
import { Card } from "@/components/ui/card";

interface DocumentViewerProps {
  file: File | null;
}

export const DocumentViewer = ({ file }: DocumentViewerProps) => {
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [file]);

  if (!file) {
    return (
      <Card className="h-full flex items-center justify-center bg-white/50 backdrop-blur-sm animate-fade-in">
        <p className="text-workspace-dark/60">Upload a document to get started</p>
      </Card>
    );
  }

  return (
    <Card className="h-full p-4 bg-white/50 backdrop-blur-sm animate-fade-in">
      <iframe
        src={url}
        className="w-full h-full rounded-lg border border-gray-200"
        title="Document Viewer"
      />
    </Card>
  );
};