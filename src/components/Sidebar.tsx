import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Brain, Bot } from "lucide-react";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onColorChange: (color: string) => void;
  uploadedFiles: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
}

export const Sidebar = ({ 
  onFileUpload, 
  onColorChange, 
  uploadedFiles, 
  onFileSelect,
  onFileDelete
}: SidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col h-full">
      <div className="flex items-center mb-4 px-2">
        <img 
          src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
          alt="Allie Digital Logo" 
          className="w-12 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/tasks')}
          style={{ fontWeight: 'inherit' }}
        >
          <CheckSquare className="h-4 w-4" style={{ fontWeight: 'inherit' }} />
          <span style={{ fontWeight: 'inherit' }}>Task Planner</span>
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/ai-assistant')}
          style={{ fontWeight: 'inherit' }}
        >
          <Bot className="h-4 w-4" style={{ fontWeight: 'inherit' }} />
          <span style={{ fontWeight: 'inherit' }}>AI Assistant</span>
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/mind-map')}
          style={{ fontWeight: 'inherit' }}
        >
          <Brain className="h-4 w-4" style={{ fontWeight: 'inherit' }} />
          <span style={{ fontWeight: 'inherit' }}>Mind Map</span>
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.html"
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
};