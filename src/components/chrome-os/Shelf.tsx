import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Home,
  Layout,
  CheckSquare,
  Brain,
  MessageSquare,
  Users
} from "lucide-react";

export const Shelf = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-workspace-dark/80 backdrop-blur-sm border-t flex items-center justify-center gap-2 px-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-white/10"
        onClick={() => navigate('/')}
      >
        <Home className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-white/10"
        onClick={() => navigate('/tasks')}
      >
        <CheckSquare className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-white/10"
        onClick={() => navigate('/mind-map')}
      >
        <Brain className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-white/10"
        onClick={() => navigate('/ai-assistant')}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-white/10"
        onClick={() => navigate('/community')}
      >
        <Users className="h-5 w-5" />
      </Button>
    </div>
  );
};