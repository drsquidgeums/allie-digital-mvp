import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Book, MessageSquare, Calendar, Trophy, Heart } from "lucide-react";

export const CommunityStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="p-4 flex flex-col items-center text-center">
        <Users className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Members</h3>
        <p className="text-2xl font-bold text-primary">892</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <MessageSquare className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Discussions</h3>
        <p className="text-2xl font-bold text-primary">71</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <Book className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Resources</h3>
        <p className="text-2xl font-bold text-primary">156</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <Calendar className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Events</h3>
        <p className="text-2xl font-bold text-primary">12</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <Trophy className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Achievements</h3>
        <p className="text-2xl font-bold text-primary">24</p>
      </Card>

      <Card className="p-4 flex flex-col items-center text-center">
        <Heart className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">Likes</h3>
        <p className="text-2xl font-bold text-primary">543</p>
      </Card>
    </div>
  );
};