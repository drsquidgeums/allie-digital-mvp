import React from "react";
import { Settings } from "@/components/Settings";
import { Sidebar } from "@/components/Sidebar";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 p-6">
        <div className="h-full">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;