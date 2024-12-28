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
      
      // Clean up the URL when component unmounts or file changes
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

  const isPDF = file.type === "application/pdf";
  const isDoc = file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPDF && !isDoc) {
    return (
      <Card className="h-full flex items-center justify-center bg-white/50 backdrop-blur-sm animate-fade-in">
        <p className="text-workspace-dark/60">Unsupported file type. Please upload a PDF or DOC file.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full p-4 bg-white/50 backdrop-blur-sm animate-fade-in">
      {isPDF ? (
        <object
          data={url}
          type="application/pdf"
          className="w-full h-full rounded-lg border border-gray-200"
        >
          <p>Unable to display PDF. Please ensure you have a PDF viewer installed.</p>
        </object>
      ) : (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          className="w-full h-full rounded-lg border border-gray-200"
          title="Document Viewer"
        />
      )}
    </Card>
  );
};