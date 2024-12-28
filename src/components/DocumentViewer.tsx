import React from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";
import { FileActions } from "./document-viewer/FileActions";
import { DocumentPreview } from "./document-viewer/DocumentPreview";

interface DocumentViewerProps {
  file: File | null;
}

export const DocumentViewer = ({ file }: DocumentViewerProps) => {
  const [url, setUrl] = React.useState<string>("");
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [file]);

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

  const handleDownload = () => {
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

  return (
    <Card className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <FileActions
          onUpload={handleUpload}
          onDownload={handleDownload}
          onDelete={handleDelete}
          hasFile={!!file}
        />
      </div>
      <div className="flex-1 p-4 relative">
        <DocumentPreview file={file} url={url} />
        <ThemeProvider />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setUrl(URL.createObjectURL(file));
            toast({
              title: "File uploaded",
              description: `${file.name} has been added to the viewer`,
            });
          }
        }}
      />
    </Card>
  );
};