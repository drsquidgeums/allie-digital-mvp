
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock, MapPin, Plus } from "lucide-react";

const studyGroups = [
  {
    id: 1,
    name: "Math Study Circle",
    subject: "Mathematics",
    participants: 8,
    maxParticipants: 12,
    time: "2:00 PM",
    type: "Active",
    location: "Room A",
    features: ["quiet", "structured"]
  },
  {
    id: 2,
    name: "Literature Discussion",
    subject: "English",
    participants: 5,
    maxParticipants: 10,
    time: "4:00 PM",
    type: "Starting Soon",
    location: "Virtual",
    features: ["discussion", "collaborative"]
  }
];

export const VisualStudyGroups = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Study Groups</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </div>

      <div className="grid gap-4">
        {studyGroups.map((group) => (
          <Card key={group.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.subject}</p>
                </div>
              </div>
              <Badge variant={group.type === "Active" ? "default" : "secondary"}>
                {group.type}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {group.time}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {group.location}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(group.participants, 4))].map((_, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        {String.fromCharCode(65 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {group.participants}/{group.maxParticipants}
                </span>
              </div>
              <Button variant="outline" size="sm">
                Join
              </Button>
            </div>

            <div className="flex gap-1 mt-2">
              {group.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
