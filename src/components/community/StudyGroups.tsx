
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Calendar, BookOpen, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  members: string[];
  maxMembers: number;
  meetingTime: string;
  creator: string;
  dateCreated: Date;
}

export const StudyGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "Biology Study Group",
      description: "Weekly study sessions for Biology 101",
      subject: "Biology",
      members: ["Sarah M.", "James K.", "Alex P."],
      maxMembers: 5,
      meetingTime: "Mondays 3:00 PM",
      creator: "Sarah M.",
      dateCreated: new Date("2024-02-15")
    },
    {
      id: "2",
      name: "Math Champions",
      description: "Advanced calculus problem solving",
      subject: "Mathematics",
      members: ["Michael R.", "Emma S."],
      maxMembers: 4,
      meetingTime: "Wednesdays 4:00 PM",
      creator: "Michael R.",
      dateCreated: new Date("2024-02-14")
    }
  ]);

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    subject: "",
    maxMembers: 5,
    meetingTime: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.subject || !newGroup.meetingTime) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      ...newGroup,
      members: ["Current User"],
      creator: "Current User",
      dateCreated: new Date()
    };

    setGroups(prev => [group, ...prev]);
    setNewGroup({
      name: "",
      description: "",
      subject: "",
      maxMembers: 5,
      meetingTime: ""
    });
    toast({
      title: "Study Group Created",
      description: "Your study group has been created successfully!"
    });
  };

  const handleJoin = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId && group.members.length < group.maxMembers
          ? { ...group, members: [...group.members, "Current User"] }
          : group
      )
    );
    toast({
      title: "Joined Study Group",
      description: "You have successfully joined the study group!"
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Study Groups</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <Input
          placeholder="Group Name"
          value={newGroup.name}
          onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
        />
        <Input
          placeholder="Description"
          value={newGroup.description}
          onChange={e => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
        />
        <Input
          placeholder="Subject"
          value={newGroup.subject}
          onChange={e => setNewGroup(prev => ({ ...prev, subject: e.target.value }))}
        />
        <Input
          placeholder="Meeting Time (e.g., Mondays 3:00 PM)"
          value={newGroup.meetingTime}
          onChange={e => setNewGroup(prev => ({ ...prev, meetingTime: e.target.value }))}
        />
        <Button type="submit" className="w-full">
          Create Study Group
        </Button>
      </form>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {groups.map(group => (
            <Card key={group.id} className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {group.name}
                  </h3>
                  {group.members.length < group.maxMembers && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleJoin(group.id)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{group.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {group.members.length}/{group.maxMembers} members
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {group.meetingTime}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Subject: {group.subject}
                </div>

                <div className="text-sm text-muted-foreground">
                  Created by {group.creator} on {group.dateCreated.toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default StudyGroups;
