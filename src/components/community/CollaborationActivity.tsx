
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, HandshakeIcon } from "lucide-react";

const CollaborationActivity = () => {
  const activities = [
    {
      id: 1,
      title: "Group Study Session",
      participants: ["Alex", "Maria", "John"],
      status: "Active",
      subject: "Mathematics"
    },
    {
      id: 2,
      title: "Peer Review",
      participants: ["Sarah", "James"],
      status: "Starting Soon",
      subject: "English Literature"
    }
  ];

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Collaborations</h2>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Join Activity
        </Button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 border rounded-lg dark:border-white/20 hover:bg-accent/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Subject: {activity.subject}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity.status === "Active" 
                  ? "bg-green-500/20 text-green-800 dark:text-green-400" 
                  : "bg-yellow-500/20 text-yellow-800 dark:text-yellow-400"
              }`}>
                {activity.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {activity.participants.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CollaborationActivity;
