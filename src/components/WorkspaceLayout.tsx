import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";

export const WorkspaceLayout = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleColorChange = (color: string) => {
    localStorage.setItem('irlenOverlayColor', color);
    document.documentElement.style.setProperty('--overlay-color', color);
    document.documentElement.style.setProperty('--overlay-display', 'block');
  };

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
  };

  const handleFileDelete = (fileToDelete: File) => {
    setUploadedFiles(uploadedFiles.filter(file => file !== fileToDelete));
  };

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarTools
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
        <SidebarContent
          activeComponent={activeComponent}
          onColorChange={handleColorChange}
          uploadedFiles={uploadedFiles}
          onFileSelect={handleFileSelect}
          onFileDelete={handleFileDelete}
        />
      </Sidebar>
      <main className="flex-1 p-6 overflow-auto">
        {/* Main content area */}
      </main>
    </div>
  );
};