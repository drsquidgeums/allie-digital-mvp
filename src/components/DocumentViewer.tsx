import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";

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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUpload}>
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!file}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={!file}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 relative">
        {!file ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Upload a document to get started</p>
          </div>
        ) : file.type === "application/pdf" ? (
          <object
            data={url}
            type="application/pdf"
            className="w-full h-full rounded-lg border border-border"
          >
            <div className="h-full flex items-center justify-center">
              <p>Unable to display PDF. Please download and open it locally.</p>
            </div>
          </object>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Word documents cannot be previewed directly.
              <br />
              Please use the download button to view the file.
            </p>
          </div>
        )}
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