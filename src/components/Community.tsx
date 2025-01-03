import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { DiscussionList } from "./community/DiscussionList";
import { CommunityChat } from "./community/CommunityChat";

export const Community = () => {
  const { toast } = useToast();

  const handleShareResource = () => {
    toast({
      title: "Coming Soon",
      description: "Resource sharing will be available in the next update!",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CommunityHeader onShareResource={handleShareResource} />
      <CommunityStats />
      <DiscussionList />
      <CommunityChat />
    </div>
  );
};