import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlarmClock, File, List, Speaker, Eye, Focus, Paintbrush, Glasses, Bot, Network } from "lucide-react";
import { PomodoroTimer } from "./PomodoroTimer";
import { TaskPlanner } from "./TaskPlanner";
import { TextToSpeech } from "./TextToSpeech";
import { BionicReader } from "./BionicReader";
import { FocusMode } from "./FocusMode";
import { ColorSeparator } from "./ColorSeparator";
import { IrlenOverlay } from "./IrlenOverlay";
import { AIAssistant } from "./AIAssistant";
import { MindMap } from "./MindMap";

interface SidebarProps {
  onFileUpload: (file: File) => void;
}

export const Sidebar = ({ onFileUpload }: SidebarProps) => {
  const [activeTab, setActiveTab] = React.useState<string>("files");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "timer":
        return <PomodoroTimer />;
      case "tasks":
        return <TaskPlanner />;
      case "tts":
        return <TextToSpeech />;
      case "bionic":
        return <BionicReader />;
      case "focus":
        return <FocusMode />;
      case "color":
        return <ColorSeparator />;
      case "irlen":
        return <IrlenOverlay />;
      case "ai":
        return <AIAssistant />;
      case "mindmap":
        return <MindMap />;
      default:
        return (
          <div className="p-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-workspace-dark text-white hover:bg-workspace-dark/90"
            >
              Upload Document
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        );
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col animate-fade-in">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-workspace-dark">Workspace</h2>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 p-2">
        <Button
          variant={activeTab === "files" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("files")}
        >
          <File className="w-4 h-4 mr-2" />
          Files
        </Button>
        <Button
          variant={activeTab === "timer" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("timer")}
        >
          <AlarmClock className="w-4 h-4 mr-2" />
          Pomodoro
        </Button>
        <Button
          variant={activeTab === "tasks" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("tasks")}
        >
          <List className="w-4 h-4 mr-2" />
          Tasks
        </Button>
        <Button
          variant={activeTab === "tts" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("tts")}
        >
          <Speaker className="w-4 h-4 mr-2" />
          Text to Speech
        </Button>
        <Button
          variant={activeTab === "bionic" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("bionic")}
        >
          <Eye className="w-4 h-4 mr-2" />
          Bionic Reader
        </Button>
        <Button
          variant={activeTab === "focus" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("focus")}
        >
          <Focus className="w-4 h-4 mr-2" />
          Focus Mode
        </Button>
        <Button
          variant={activeTab === "color" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("color")}
        >
          <Paintbrush className="w-4 h-4 mr-2" />
          Color Separator
        </Button>
        <Button
          variant={activeTab === "irlen" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("irlen")}
        >
          <Glasses className="w-4 h-4 mr-2" />
          Irlen Overlay
        </Button>
        <Button
          variant={activeTab === "ai" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("ai")}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
        <Button
          variant={activeTab === "mindmap" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActiveTab("mindmap")}
        >
          <Network className="w-4 h-4 mr-2" />
          Mind Map
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};