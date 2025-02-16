
import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { DiscussionList } from "./community/DiscussionList";
import { CommunityChat } from "./community/CommunityChat";
import { ResourceShare } from "./community/ResourceShare";

export const Community = () => {
  const { toast } = useToast();
  const mainRef = useRef<HTMLDivElement>(null);

  const handleShareResource = () => {
    mainRef.current?.querySelector('input')?.focus();
    toast({
      title: "Share a Resource",
      description: "Use the resource sharing form below to share with the community!",
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
      ref={mainRef}
    >
      <div className="p-4 space-y-4">
        <CommunityHeader onShareResource={handleShareResource} />
        <CommunityStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <DiscussionList />
            <CommunityChat />
          </div>
          <ResourceShare />
        </div>
      </div>
    </Card>
  );
};
