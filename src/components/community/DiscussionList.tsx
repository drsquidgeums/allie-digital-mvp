
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Users, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  replies: number;
  participants: number;
  tags: string[];
}

export const DiscussionList = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: "1",
      title: "Study Tips for Final Exams",
      content: "What are your best strategies for preparing for final exams?",
      author: "Sarah M.",
      date: new Date("2024-02-15"),
      replies: 12,
      participants: 8,
      tags: ["Study Tips", "Exams"]
    },
    {
      id: "2",
      title: "Group Study Sessions",
      content: "Looking to form a study group for biology. Anyone interested?",
      author: "James K.",
      date: new Date("2024-02-14"),
      replies: 5,
      participants: 4,
      tags: ["Study Group", "Biology"]
    }
  ]);

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const discussion: Discussion = {
      id: Date.now().toString(),
      ...newDiscussion,
      author: "Current User",
      date: new Date(),
      replies: 0,
      participants: 1,
      tags: ["General"]
    };

    setDiscussions(prev => [discussion, ...prev]);
    setNewDiscussion({ title: "", content: "" });
    toast({
      title: "Discussion Created",
      description: "Your discussion has been posted successfully!"
    });
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Discussions</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Input
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={e => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="What would you like to discuss?"
            value={newDiscussion.content}
            onChange={e => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
          />
          <Button type="submit" className="w-full">
            Start Discussion
          </Button>
        </form>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {discussions.map(discussion => (
            <Card key={discussion.id} className="p-4 bg-muted/50">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{discussion.title}</h3>
                <p className="text-sm text-muted-foreground">{discussion.content}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {discussion.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2 pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {discussion.replies} replies
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {discussion.participants} participants
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {discussion.date.toLocaleDateString()}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mt-2">
                  Posted by {discussion.author}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
