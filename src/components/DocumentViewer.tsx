import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="h-full p-4 bg-white/50 backdrop-blur-sm animate-fade-in">
      {isPDF ? (
        <div className="h-full flex flex-col">
          <div className="flex justify-end mb-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <object
            data={url}
            type="application/pdf"
            className="w-full flex-1 rounded-lg border border-gray-200"
          >
            <div className="h-full flex items-center justify-center">
              <p>Unable to display PDF. Please download and open it locally.</p>
            </div>
          </object>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <p className="text-workspace-dark/60">Word documents cannot be previewed directly.</p>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Document
          </Button>
        </div>
      )}
    </Card>
  );
};