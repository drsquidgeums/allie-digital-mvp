import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface Discussion {
  title: string;
  author: string;
  replies: number;
  category: string;
}

export const DiscussionList = () => {
  const discussions: Discussion[] = [
    {
      title: "Study Tips & Tricks",
      author: "Sarah M.",
      replies: 23,
      category: "Learning Strategies"
    },
    {
      title: "Focus Mode Success Stories",
      author: "James K.",
      replies: 15,
      category: "Productivity"
    },
    {
      title: "Mind Mapping Templates",
      author: "Alex R.",
      replies: 31,
      category: "Resources"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Discussions</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        {discussions.map((discussion, index) => (
          <Card key={index} className="p-4 mb-4 last:mb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{discussion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Posted by {discussion.author}
                </p>
              </div>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                {discussion.category}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-1" />
              {discussion.replies} replies
            </div>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};