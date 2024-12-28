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
import { NotificationCenter } from "./NotificationCenter";

interface SidebarProps {
  onFileUpload: (file: File) => void;
}

export const Sidebar = ({ onFileUpload }: SidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <div className="flex items-center justify-between mb-6">
        <NotificationCenter />
      </div>
      <div className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pomodoro Timer
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Task Planner
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Headphones className="h-4 w-4" />
          Text-to-Speech
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Bionic Reader
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Focus className="h-4 w-4" />
          Focus Mode
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Irlen Overlay
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Mind Map
        </Button>

        <Button variant="ghost" className="w-full flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
};