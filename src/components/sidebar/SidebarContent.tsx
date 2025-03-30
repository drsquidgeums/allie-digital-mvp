
import React from "react";
import { PomodoroTimer } from "../PomodoroTimer";
import { TextToSpeech } from "../TextToSpeech";
import { BionicReader } from "../BionicReader";
import { FocusMode } from "../FocusMode";
import { IrlenOverlay } from "../IrlenOverlay";
import { MindMap } from "../MindMap";
import { ColorSeparator } from "../ColorSeparator";
import { FileList } from "../FileList";

interface SidebarContentProps {
  activeComponent: string | null;
  onColorChange: (color: string) => void;
  uploadedFiles: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  onFileUpload: () => void;
}

export const SidebarContent = ({ 
  activeComponent,
  onColorChange,
  uploadedFiles,
  onFileSelect,
  onFileDelete,
  onFileUpload
}: SidebarContentProps) => {
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
      case "color":
        return <ColorSeparator onColorChange={onColorChange} />;
      case "files":
        return <FileList 
          files={uploadedFiles} 
          onFileSelect={onFileSelect}
          onFileDelete={onFileDelete}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto mt-4">
      {renderActiveComponent()}
    </div>
  );
};
