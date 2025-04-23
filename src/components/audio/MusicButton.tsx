
import React from "react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import {
  PopoverTrigger,
} from "@/components/ui/popover";

interface MusicButtonProps {
  isPlaying: boolean;
  isDisabled: boolean;
}

export const MusicButton = ({
  isPlaying,
  isDisabled,
}: MusicButtonProps) => {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isPlaying ? "text-primary ring-2 ring-primary" : ""
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        <Music className="h-4 w-4" />
        {isPlaying && (
          <div 
            className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
            role="status"
            aria-label="Music playing"
          />
        )}
      </Button>
    </PopoverTrigger>
  );
};
