import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIAssistant as AIAssistantComponent } from "@/components/AIAssistant";
import { Sidebar } from "@/components/Sidebar";

const AIAssistant = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-6">
            <Card className="p-6 shadow-lg">
              <AIAssistantComponent />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;