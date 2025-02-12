
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface CommunityHeaderProps {
  onShareResource: () => void;
}

export const CommunityHeader = ({ onShareResource }: CommunityHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Community Hub</h1>
      <Button onClick={onShareResource}>
        <Share2 className="mr-2 h-4 w-4" />
        Share Resource
      </Button>
    </div>
  );
};
