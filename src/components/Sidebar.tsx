import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Upload,
  Clock,
  CheckSquare,
  Headphones,
  Eye,
  Focus,
  Palette,
  Brain,
  MessageSquare,
  FolderOpen
} from "lucide-react";
import { PomodoroTimer } from "./PomodoroTimer";
import { TextToSpeech } from "./TextToSpeech";
import { BionicReader } from "./BionicReader";
import { FocusMode } from "./FocusMode";
import { IrlenOverlay } from "./IrlenOverlay";
import { MindMap } from "./MindMap";
import { AIAssistant } from "./AIAssistant";
import { ColorSeparator } from "./ColorSeparator";
import { FileList } from "./FileList";

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onColorChange: (color: string) => void;
  uploadedFiles: File[];
  onFileSelect: (file: File) => void;
}

export const Sidebar = ({ onFileUpload, onColorChange, uploadedFiles, onFileSelect }: SidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "pomodoro":
        return <PomodoroTimer />;
      case "tts":
        return <TextToSpeech />;
      case "bionic":
        return <BionicReader />;
      case "focus":
        return <FocusMode />;
      case "irlen":
        return <IrlenOverlay />;
      case "mindmap":
        return <MindMap />;
      case "ai":
        return <AIAssistant />;
      case "color":
        return <ColorSeparator onColorChange={onColorChange} />;
      case "files":
        return <FileList files={uploadedFiles} onFileSelect={onFileSelect} />;
      default:
        return null;
    }
  };

  const handleTasksClick = () => {
    navigate('/tasks');
  };

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col h-full">
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={handleTasksClick}
        >
          <CheckSquare className="h-4 w-4" />
          Task Planner
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 px-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>

        <Button 
          variant={activeComponent === "files" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("files")}
        >
          <FolderOpen className="h-4 w-4" />
          Files
        </Button>

        <Button 
          variant={activeComponent === "pomodoro" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("pomodoro")}
        >
          <Clock className="h-4 w-4" />
          Pomodoro Timer
        </Button>

        <Button 
          variant={activeComponent === "tts" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("tts")}
        >
          <Headphones className="h-4 w-4" />
          Text-to-Speech
        </Button>

        <Button 
          variant={activeComponent === "bionic" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("bionic")}
        >
          <Eye className="h-4 w-4" />
          Bionic Reader
        </Button>

        <Button 
          variant={activeComponent === "focus" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("focus")}
        >
          <Focus className="h-4 w-4" />
          Focus Mode
        </Button>

        <Button 
          variant={activeComponent === "irlen" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("irlen")}
        >
          <Palette className="h-4 w-4" />
          Irlen Overlay
        </Button>

        <Button 
          variant={activeComponent === "mindmap" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("mindmap")}
        >
          <Brain className="h-4 w-4" />
          Mind Map
        </Button>

        <Button 
          variant={activeComponent === "ai" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("ai")}
        >
          <MessageSquare className="h-4 w-4" />
          AI Assistant
        </Button>
      </div>
      <div className="flex-1 overflow-auto mt-4">
        {renderActiveComponent()}
      </div>
    </div>
  );
};