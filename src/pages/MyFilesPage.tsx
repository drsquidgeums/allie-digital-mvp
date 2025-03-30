
import React from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { FileList } from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MyFilesPageProps {
  files?: File[];
  onFileSelect?: (file: File) => void;
  onFileDelete?: (file: File) => void;
}

const MyFilesPage: React.FC<MyFilesPageProps> = ({ 
  files = [], 
  onFileSelect = () => {}, 
  onFileDelete = () => {} 
}) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would be handled by the parent component
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  return (
    <WorkspaceLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            My Files
          </h1>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.html"
              aria-label="Upload file"
            />
            <Button 
              onClick={handleFileUpload}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>

        <div className="border rounded-md p-4 bg-card">
          <FileList 
            files={files} 
            onFileSelect={onFileSelect}
            onFileDelete={onFileDelete}
          />
          
          {files.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
              No files uploaded yet. Click Upload to add files.
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default MyFilesPage;
