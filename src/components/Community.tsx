import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { DiscussionList } from "./community/DiscussionList";
import { CommunityChat } from "./community/CommunityChat";
import { Users, Trophy, Calendar, Bookmark, Heart } from "lucide-react";

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
        
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-4">
            <DiscussionList />
            <CommunityChat />
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <EventCard 
                  title="Study Group: Focus Techniques"
                  date="Next Tuesday, 3 PM"
                  attendees={12}
                />
                <EventCard 
                  title="Workshop: Mind Mapping Basics"
                  date="Friday, 2 PM"
                  attendees={8}
                />
                <EventCard 
                  title="Q&A: Learning Strategies"
                  date="Next Monday, 4 PM"
                  attendees={15}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AchievementCard 
                  title="Active Participant"
                  description="Contributed to 10 discussions"
                  progress={70}
                />
                <AchievementCard 
                  title="Resource Sharer"
                  description="Shared 5 helpful resources"
                  progress={40}
                />
                <AchievementCard 
                  title="Event Organizer"
                  description="Created your first study group"
                  progress={20}
                />
                <AchievementCard 
                  title="Helpful Member"
                  description="Received 50 likes on your responses"
                  progress={90}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Saved Items</h3>
              <div className="space-y-4">
                <SavedItemCard 
                  title="Study Tips & Tricks"
                  type="Discussion"
                  savedDate="2 days ago"
                />
                <SavedItemCard 
                  title="Focus Mode Tutorial"
                  type="Resource"
                  savedDate="1 week ago"
                />
                <SavedItemCard 
                  title="Mind Mapping Workshop"
                  type="Event"
                  savedDate="3 days ago"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

const EventCard = ({ title, date, attendees }: { title: string; date: string; attendees: number }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4" />
      <span className="text-sm">{attendees} attending</span>
    </div>
  </div>
);

const AchievementCard = ({ title, description, progress }: { title: string; description: string; progress: number }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start justify-between mb-2">
      <Trophy className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">{progress}%</span>
    </div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="w-full h-2 bg-secondary rounded-full mt-2">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const SavedItemCard = ({ title, type, savedDate }: { title: string; type: string; savedDate: string }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
    <div className="flex items-center gap-3">
      {type === "Discussion" && <Users className="h-4 w-4" />}
      {type === "Resource" && <Bookmark className="h-4 w-4" />}
      {type === "Event" && <Calendar className="h-4 w-4" />}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{type} • Saved {savedDate}</p>
      </div>
    </div>
    <Heart className="h-4 w-4 text-primary" />
  </div>
);