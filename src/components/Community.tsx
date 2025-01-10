import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { DiscussionList } from "./community/DiscussionList";
import { CommunityChat } from "./community/CommunityChat";

export const Community = () => {
  const { toast } = useToast();
  const mainRef = useRef<HTMLDivElement>(null);

  const handleShareResource = () => {
    toast({
      title: "Coming Soon",
      description: "Resource sharing will be available in the next update!",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      mainRef.current?.focus();
    }
  };

  return (
    <div 
      className="flex-1 min-h-screen bg-background animate-fade-in"
      onKeyDown={handleKeyDown}
      role="main"
      aria-label="Community Dashboard"
    >
      <div className="container mx-auto py-4 px-4">
        <div 
          ref={mainRef}
          className="max-w-4xl mx-auto space-y-6 focus:outline-none"
          tabIndex={-1}
        >
          <CommunityHeader onShareResource={handleShareResource} />
          <CommunityStats />
          <DiscussionList />
          <CommunityChat />
        </div>
      </div>
    </div>
  );
};