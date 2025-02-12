import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
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
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="Community Dashboard"
      onKeyDown={handleKeyDown}
    >
      <div className="p-4 space-y-4">
        <CommunityHeader onShareResource={handleShareResource} />
        <CommunityStats />
        <DiscussionList />
        <CommunityChat />
      </div>
    </Card>
  );
};