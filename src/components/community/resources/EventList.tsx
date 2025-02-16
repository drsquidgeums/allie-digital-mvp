
import React from "react";
import { Card } from "@/components/ui/card";
import { Link, UserPlus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  invitees: string[];
  link?: string;
}

interface EventListProps {
  events: Event[];
}

export const EventList = ({ events }: EventListProps) => {
  return (
    <div className="space-y-2">
      {events.map(event => (
        <Card key={event.id} className="p-3 bg-muted/50">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium">{event.title}</h5>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              {event.link && (
                <a 
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center mt-1 hover:underline"
                >
                  <Link className="h-4 w-4 mr-1" />
                  Join Meeting
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserPlus className="h-4 w-4" />
              <span>{event.invitees.length} invited</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
