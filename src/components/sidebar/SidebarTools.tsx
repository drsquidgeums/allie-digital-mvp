import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Brain, Bot, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarToolsProps {
  activeComponent: string | null;
  setActiveComponent: (component: string | null) => void;
}

export const SidebarTools = ({ activeComponent, setActiveComponent }: SidebarToolsProps) => {
  const navigate = useNavigate();

  return (
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

      <Button 
        variant="ghost"
        className="w-full flex items-center justify-start gap-2 px-2"
        onClick={() => navigate('/community')}
        style={{ fontWeight: 'inherit' }}
      >
        <Users className="h-4 w-4" style={{ fontWeight: 'inherit' }} />
        <span style={{ fontWeight: 'inherit' }}>Community</span>
      </Button>
    </div>
  );
};