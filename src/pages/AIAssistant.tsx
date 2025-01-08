import React from "react";
import { Card } from "@/components/ui/card";
import { AIAssistant as AIAssistantComponent } from "@/components/AIAssistant";
import { Sidebar } from "@/components/Sidebar";

const AIAssistant = () => {
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
          <Card className="h-full shadow-lg">
            <AIAssistantComponent />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;