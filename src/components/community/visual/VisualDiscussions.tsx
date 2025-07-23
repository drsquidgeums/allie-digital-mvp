
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Clock, Plus } from "lucide-react";

const discussions = [
  {
    id: 1,
    title: "Need help with calculus derivatives",
    author: "Sarah M.",
    replies: 12,
    likes: 8,
    time: "2h ago",
    category: "Math",
    isAnswered: false
  },
  {
    id: 2,
    title: "Best study techniques for memorization?",
    author: "Alex K.",
    replies: 24,
    likes: 15,
    time: "4h ago",
    category: "Study Tips",
    isAnswered: true
  }
];

export const VisualDiscussions = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Discussions</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ask
        </Button>
      </div>

      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{discussion.author[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm leading-tight">{discussion.title}</h3>
                  {discussion.isAnswered && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      Solved
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span>{discussion.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {discussion.time}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {discussion.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {discussion.replies}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    {discussion.likes}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
