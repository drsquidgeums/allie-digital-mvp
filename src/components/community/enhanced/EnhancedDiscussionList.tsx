
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SafeSpaceIndicator } from "../moderation/SafeSpaceIndicator";
import { MessageSquare, Users, Calendar, ThumbsUp, Heart, Lightbulb } from "lucide-react";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  replies: number;
  participants: number;
  tags: string[];
  safeSpaceFeatures: string[];
  reactionCounts: { [key: string]: number };
  contentFormat: 'text' | 'structured' | 'visual';
}

export const EnhancedDiscussionList = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: "1",
      title: "Study Strategies for Different Learning Styles",
      content: "Let's share strategies that work for visual, auditory, and kinesthetic learners...",
      author: "Sarah M.",
      date: new Date("2024-02-15"),
      replies: 12,
      participants: 8,
      tags: ["Study Tips", "Learning Styles"],
      safeSpaceFeatures: ["neurodivergent-friendly", "structured-communication"],
      reactionCounts: { "👍": 5, "❤️": 3, "💡": 2 },
      contentFormat: 'structured'
    },
    {
      id: "2",
      title: "Biology Study Group - Quiet Session",
      content: "Looking for study partners who prefer minimal talking and focused work...",
      author: "James K.",
      date: new Date("2024-02-14"),
      replies: 5,
      participants: 4,
      tags: ["Study Group", "Biology", "Quiet Space"],
      safeSpaceFeatures: ["neurodivergent-friendly", "patient-environment"],
      reactionCounts: { "👍": 8, "🤝": 4 },
      contentFormat: 'text'
    }
  ]);

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    contentFormat: "text" as const,
    tags: [] as string[],
    enableSafeSpace: true
  });

  const PREDEFINED_TAGS = [
    "Study Tips", "Group Study", "Biology", "Mathematics", "Physics", "Chemistry",
    "Quiet Space", "Visual Learning", "Audio Learning", "ADHD Friendly", 
    "Autism Friendly", "Anxiety Support", "Time Management", "Focus Techniques"
  ];

  const REACTION_EMOJIS = ["👍", "❤️", "💡", "🤝", "🎯", "⭐"];

  const handleReaction = (discussionId: string, emoji: string) => {
    setDiscussions(prev =>
      prev.map(disc => {
        if (disc.id === discussionId) {
          const newCounts = { ...disc.reactionCounts };
          newCounts[emoji] = (newCounts[emoji] || 0) + 1;
          return { ...disc, reactionCounts: newCounts };
        }
        return disc;
      })
    );
    
    toast({
      title: "Reaction Added",
      description: "Your reaction has been shared with the community"
    });
  };

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
      safeSpaceFeatures: newDiscussion.enableSafeSpace 
        ? ["neurodivergent-friendly", "structured-communication", "patient-environment"]
        : [],
      reactionCounts: {}
    };

    setDiscussions(prev => [discussion, ...prev]);
    setNewDiscussion({ 
      title: "", 
      content: "", 
      contentFormat: "text", 
      tags: [], 
      enableSafeSpace: true 
    });
    
    toast({
      title: "Discussion Created",
      description: "Your discussion has been posted successfully!"
    });
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Enhanced Discussions</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <Input
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <Textarea
            placeholder="What would you like to discuss? Be as detailed as you'd like."
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              value={newDiscussion.contentFormat} 
              onValueChange={(value: any) => setNewDiscussion(prev => ({ ...prev, contentFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Content Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Simple Text</SelectItem>
                <SelectItem value="structured">Structured with Headers</SelectItem>
                <SelectItem value="visual">Visual with Images/Diagrams</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="safeSpace"
                checked={newDiscussion.enableSafeSpace}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, enableSafeSpace: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="safeSpace" className="text-sm">
                Enable as Safe Space
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Create Discussion
          </Button>
        </form>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {discussions.map(discussion => (
            <Card key={discussion.id} className="p-4 bg-muted/50 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {discussion.title}
                  </h3>
                  <SafeSpaceIndicator 
                    features={discussion.safeSpaceFeatures} 
                    size="sm" 
                  />
                </div>
                <Badge variant="outline" className="ml-2">
                  {discussion.contentFormat}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{discussion.content}</p>
              
              <div className="flex flex-wrap gap-2">
                {discussion.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Reaction Bar */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-xs text-muted-foreground mr-2">Quick reactions:</span>
                {REACTION_EMOJIS.map(emoji => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleReaction(discussion.id, emoji)}
                  >
                    {emoji} {discussion.reactionCounts[emoji] || 0}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
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

              <div className="text-sm text-muted-foreground">
                Posted by {discussion.author}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
