import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyBuddyToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  hasUnread?: boolean;
}

export const StudyBuddyToggle: React.FC<StudyBuddyToggleProps> = ({
  isOpen,
  onToggle,
  hasUnread = false
}) => {
  return (
    <Button
      onClick={onToggle}
      size="lg"
      data-tour="study-buddy"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "hover:scale-110 active:scale-95",
        isOpen && "rotate-90"
      )}
      aria-label={isOpen ? "Close Study Buddy" : "Open Study Buddy"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageCircle className="h-6 w-6" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
          )}
        </>
      )}
    </Button>
  );
};
