import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload,
  Clock,
  CheckSquare,
  Headphones,
  Eye,
  Focus,
  Palette,
  Brain,
  MessageSquare
} from "lucide-react";
import { PomodoroTimer } from "./PomodoroTimer";
import { TaskPlanner } from "./TaskPlanner";
import { TextToSpeech } from "./TextToSpeech";
import { BionicReader } from "./BionicReader";
import { FocusMode } from "./FocusMode";
import { IrlenOverlay } from "./IrlenOverlay";
import { MindMap } from "./MindMap";
import { AIAssistant } from "./AIAssistant";

interface SidebarProps {
  onFileUpload: (file: File) => void;
}

export const Sidebar = ({ onFileUpload }: SidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);

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
      case "tasks":
        return <TaskPlanner />;
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
      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col h-full">
      <div className="space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-start gap-2 px-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
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
          variant={activeComponent === "tasks" ? "default" : "ghost"} 
          className="w-full flex items-center justify-start gap-2 px-2"
          onClick={() => setActiveComponent("tasks")}
        >
          <CheckSquare className="h-4 w-4" />
          Task Planner
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