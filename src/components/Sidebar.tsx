import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";

interface SidebarProps {
  onFileUpload: (file: File) => void;
}

export const Sidebar = ({ onFileUpload }: SidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <div className="flex items-center justify-between mb-6">
        <NotificationCenter />
      </div>
      <div className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};