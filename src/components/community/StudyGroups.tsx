
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Calendar, BookOpen, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SafeSpaceIndicator } from "./moderation/SafeSpaceIndicator";

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
  safeSpaceFeatures: string[];
  learningAccommodations: string[];
}

export const StudyGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "Biology Study Group - Quiet Focus",
      description: "Weekly study sessions for Biology 101 with minimal distractions",
      subject: "Biology",
      members: ["Sarah M.", "James K.", "Alex P."],
      maxMembers: 5,
      meetingTime: "Mondays 3:00 PM",
      creator: "Sarah M.",
      dateCreated: new Date("2024-02-15"),
      safeSpaceFeatures: ["neurodivergent-friendly", "structured-communication", "patient-environment"],
      learningAccommodations: ["Extra processing time", "Written instructions", "Break reminders"]
    },
    {
      id: "2",
      name: "Math Champions - Visual Learning",
      description: "Advanced calculus with visual aids and step-by-step explanations",
      subject: "Mathematics",
      members: ["Michael R.", "Emma S."],
      maxMembers: 4,
      meetingTime: "Wednesdays 4:00 PM",
      creator: "Michael R.",
      dateCreated: new Date("2024-02-14"),
      safeSpaceFeatures: ["neurodivergent-friendly", "verified-safe"],
      learningAccommodations: ["Visual aids", "No pressure to speak", "Structured sessions"]
    }
  ]);

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    subject: "",
    maxMembers: 5,
    meetingTime: ""
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newGroup.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a study group name",
        variant: "destructive"
      });
      return;
    }

    if (!newGroup.subject.trim()) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject",
        variant: "destructive"
      });
      return;
    }

    if (!newGroup.meetingTime.trim()) {
      toast({
        title: "Meeting Time Required",
        description: "Please enter a meeting time",
        variant: "destructive"
      });
      return;
    }

    if (newGroup.maxMembers < 2 || newGroup.maxMembers > 20) {
      toast({
        title: "Invalid Group Size",
        description: "Group size must be between 2 and 20 members",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name.trim(),
      description: newGroup.description.trim() || `Study group for ${newGroup.subject}`,
      subject: newGroup.subject.trim(),
      maxMembers: newGroup.maxMembers,
      meetingTime: newGroup.meetingTime.trim(),
      members: ["You"],
      creator: "You",
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
    
    setIsCreating(false);
    
    toast({
      title: "Study Group Created! 🎉",
      description: `"${group.name}" has been created successfully. You are now the group leader.`
    });
  };

  const handleJoin = (groupId: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId && group.members.length < group.maxMembers && !group.members.includes("You")) {
          const updatedGroup = { ...group, members: [...group.members, "You"] };
          toast({
            title: "Joined Study Group! 🎊",
            description: `You have successfully joined "${group.name}"`
          });
          return updatedGroup;
        }
        return group;
      })
    );
  };

  const handleInputChange = (field: keyof typeof newGroup, value: string | number) => {
    setNewGroup(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Study Groups</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-medium text-lg">Create New Study Group</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Group Name *"
            value={newGroup.name}
            onChange={e => handleInputChange('name', e.target.value)}
            maxLength={50}
            required
          />
          <Input
            placeholder="Subject *"
            value={newGroup.subject}
            onChange={e => handleInputChange('subject', e.target.value)}
            maxLength={30}
            required
          />
        </div>
        
        <Input
          placeholder="Description (optional)"
          value={newGroup.description}
          onChange={e => handleInputChange('description', e.target.value)}
          maxLength={100}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Meeting Time (e.g., Mondays 3:00 PM) *"
            value={newGroup.meetingTime}
            onChange={e => handleInputChange('meetingTime', e.target.value)}
            maxLength={50}
            required
          />
          <div className="space-y-1">
            <Input
              type="number"
              placeholder="Max Members"
              value={newGroup.maxMembers}
              onChange={e => handleInputChange('maxMembers', parseInt(e.target.value) || 5)}
              min="2"
              max="20"
              required
            />
            <p className="text-xs text-muted-foreground">Between 2-20 members</p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isCreating}
          loading={isCreating}
        >
          {isCreating ? "Creating Study Group..." : "Create Study Group"}
        </Button>
      </form>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {groups.map(group => (
            <Card key={group.id} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {group.name}
                    </h3>
                    <SafeSpaceIndicator 
                      features={group.safeSpaceFeatures} 
                      size="sm" 
                    />
                  </div>
                  {group.members.length < group.maxMembers && !group.members.includes("You") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleJoin(group.id)}
                      className="hover:bg-primary hover:text-primary-foreground ml-2"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                  {group.members.includes("You") && (
                    <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded ml-2">
                      ✓ Joined
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{group.description}</p>

                {/* Learning Accommodations */}
                {group.learningAccommodations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Learning Accommodations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {group.learningAccommodations.map(accommodation => (
                        <span 
                          key={accommodation}
                          className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full"
                        >
                          {accommodation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
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
                  Subject: <span className="font-medium">{group.subject}</span>
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
