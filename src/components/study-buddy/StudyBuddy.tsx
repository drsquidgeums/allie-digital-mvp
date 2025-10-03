import React, { useState } from "react";
import { StudyBuddyToggle } from "./StudyBuddyToggle";
import { StudyBuddyChat } from "./StudyBuddyChat";
import { useStudyBuddy } from "@/hooks/useStudyBuddy";
import { cn } from "@/lib/utils";

export const StudyBuddy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useStudyBuddy();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <StudyBuddyToggle 
        isOpen={isOpen} 
        onToggle={handleToggle}
      />

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-96 h-[600px] transition-all duration-300",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <StudyBuddyChat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onClearMessages={clearMessages}
        />
      </div>
    </>
  );
};
