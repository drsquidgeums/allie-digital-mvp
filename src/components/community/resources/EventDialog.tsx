
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Video } from "lucide-react";

interface EventDialogProps {
  newEvent: {
    title: string;
    description: string;
    invitees: string;
    link: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const EventDialog = ({ newEvent, onChange, onSubmit }: EventDialogProps) => {
  const createGoogleMeetLink = () => {
    // Generate a unique meeting ID
    const meetingId = `meet-${Math.random().toString(36).substring(2, 11)}`;
    const meetLink = `https://meet.google.com/${meetingId}`;
    onChange("link", meetLink);
  };

  const createZoomLink = () => {
    // Using Zoom's web client link structure
    const meetingId = Math.random().toString().substring(2, 11);
    const zoomLink = `https://zoom.us/j/${meetingId}`;
    onChange("link", zoomLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-foreground border-border">
        <div className="flex justify-between items-start">
          <DialogHeader>
            <DialogTitle className="text-foreground">Schedule Study Group Event</DialogTitle>
          </DialogHeader>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </div>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Event Title"
            value={newEvent.title}
            onChange={e => onChange("title", e.target.value)}
          />
          <Textarea 
            placeholder="Event Description"
            value={newEvent.description}
            onChange={e => onChange("description", e.target.value)}
            className="min-h-[100px]"
          />
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Meeting Link
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Meeting Link (optional)"
                value={newEvent.link}
                onChange={e => onChange("link", e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={createGoogleMeetLink}
                className="group relative w-10 hover:w-20 transition-all duration-200 overflow-hidden"
              >
                <Video className="h-4 w-4 absolute left-3" />
                <span className="opacity-0 group-hover:opacity-100 ml-6">Meet</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={createZoomLink}
                className="group relative w-10 hover:w-20 transition-all duration-200 overflow-hidden"
              >
                <Video className="h-4 w-4 absolute left-3" />
                <span className="opacity-0 group-hover:opacity-100 ml-6">Zoom</span>
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              Invite Users (comma-separated emails)
            </label>
            <Input
              placeholder="user@example.com, user2@example.com"
              value={newEvent.invitees}
              onChange={e => onChange("invitees", e.target.value)}
            />
          </div>
          <Button onClick={onSubmit} className="w-full">
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
