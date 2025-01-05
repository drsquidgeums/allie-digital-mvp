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
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2 font-[var(--font-weight)]"
          onClick={() => navigate('/tasks')}
        >
          <CheckSquare className="h-4 w-4 font-[var(--font-weight)]" />
          Task Planner
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2 font-[var(--font-weight)]"
          onClick={() => navigate('/ai-assistant')}
        >
          <Bot className="h-4 w-4 font-[var(--font-weight)]" />
          AI Assistant
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2 font-[var(--font-weight)]"
          onClick={() => navigate('/mind-map')}
        >
          <Brain className="h-4 w-4" />
          Mind Map
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