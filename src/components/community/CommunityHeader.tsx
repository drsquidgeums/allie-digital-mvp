import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunityHeaderProps {
  onShareResource: () => void;
}

export const CommunityHeader = ({ onShareResource }: CommunityHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Community Hub</h1>
      <div className="flex items-center gap-2">
        <Button onClick={onShareResource}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Resource
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};