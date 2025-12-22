
import React from "react";
import { Music } from "lucide-react";
import { PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MusicButtonProps {
  isPlaying: boolean;
  isDisabled: boolean;
}

export const MusicButton = ({ isPlaying, isDisabled }: MusicButtonProps) => {
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 w-9 px-0 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isPlaying && "text-primary ring-2 ring-primary",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label="Ambient Music"
      >
        <Music className="h-4 w-4" />
        {isPlaying && (
          <div
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"
            role="status"
            aria-label="Music playing"
          />
        )}
      </button>
    </PopoverTrigger>
  );
};

