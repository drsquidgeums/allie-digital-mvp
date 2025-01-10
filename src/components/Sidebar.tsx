import React, { useRef } from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onColorChange: (color: string) => void;
  uploadedFiles: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
}

export const Sidebar = React.memo(({ 
  onFileUpload, 
  onColorChange, 
  uploadedFiles, 
  onFileSelect,
  onFileDelete
}: SidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string | null>("files");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      sidebarRef.current?.focus();
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className="w-64 bg-card border-r border-border p-4 flex flex-col h-full"
      role="navigation"
      aria-label="Main navigation"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SidebarLogo />
      
      <div className="space-y-2">
        <SidebarNavigation 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.html"
          aria-label="Upload file"
        />

        <SidebarTools 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
      </div>
      
      <SidebarContent 
        activeComponent={activeComponent}
        onColorChange={onColorChange}
        uploadedFiles={uploadedFiles}
        onFileSelect={onFileSelect}
        onFileDelete={onFileDelete}
      />
    </div>
  );
});

Sidebar.displayName = "Sidebar";