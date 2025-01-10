import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Brain, Bot, Monitor } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string | null>("files");
  const navigate = useNavigate();
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

  // Memoize the logo to prevent re-rendering
  const Logo = React.memo(() => (
    <img 
      src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
      alt="Allie Digital Logo" 
      className="w-12 h-12"
    />
  ));

  return (
    <div 
      ref={sidebarRef}
      className="w-64 bg-card border-r border-border p-4 flex flex-col h-full"
      role="navigation"
      aria-label="Main navigation"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="flex items-center mb-4 px-2"
        role="banner"
      >
        <Logo />
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => {
            setActiveComponent("files");
            navigate('/');
          }}
          style={{ fontWeight: 'inherit' }}
          aria-current={activeComponent === "files" ? "page" : undefined}
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span>File Uploader</span>
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/tasks')}
          style={{ fontWeight: 'inherit' }}
          aria-current={location.pathname === '/tasks' ? "page" : undefined}
        >
          <CheckSquare className="h-4 w-4" aria-hidden="true" />
          <span>Task Planner</span>
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/ai-assistant')}
          style={{ fontWeight: 'inherit' }}
          aria-current={location.pathname === '/ai-assistant' ? "page" : undefined}
        >
          <Bot className="h-4 w-4" aria-hidden="true" />
          <span>AI Assistant</span>
        </Button>

        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => navigate('/mind-map')}
          style={{ fontWeight: 'inherit' }}
          aria-current={location.pathname === '/mind-map' ? "page" : undefined}
        >
          <Brain className="h-4 w-4" aria-hidden="true" />
          <span>Mind Map</span>
        </Button>

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
};