
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Book, MessageSquare } from "lucide-react";

export const CommunityStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 flex flex-col items-center text-center">
        <Users className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Active Members</h3>
        <p className="text-2xl font-bold text-primary">892</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <MessageSquare className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Discussions</h3>
        <p className="text-2xl font-bold text-primary">71</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <Book className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Resources</h3>
        <p className="text-2xl font-bold text-primary">156</p>
      </Card>
    </div>
  );
};
