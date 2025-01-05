import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Brain, MessageSquare } from "lucide-react";
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
  const [activeComponent, setActiveComponent] = React.useState<string | null>("files");
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const buttonClassName = "w-full flex items-center justify-start gap-2 px-2 font-inherit text-inherit";

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col h-full" style={{ fontWeight: 'inherit' }}>
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className={buttonClassName}
          onClick={() => navigate('/tasks')}
          style={{ fontWeight: 'inherit' }}
        >
          <CheckSquare className="h-4 w-4" />
          Task Planner
        </Button>

        <Button 
          variant="ghost"
          className={buttonClassName}
          onClick={() => navigate('/ai-assistant')}
          style={{ fontWeight: 'inherit' }}
        >
          <MessageSquare className="h-4 w-4" />
          AI Assistant
        </Button>

        <Button 
          variant="ghost"
          className={buttonClassName}
          onClick={() => navigate('/mind-map')}
          style={{ fontWeight: 'inherit' }}
        >
          <Brain className="h-4 w-4" />
          Mind Map
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.html,.odt,.rtf,.epub,.md"
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
