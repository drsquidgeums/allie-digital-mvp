
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
import { Plus } from "lucide-react";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Study Group Event</DialogTitle>
        </DialogHeader>
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
          <Input
            placeholder="Meeting Link (optional)"
            value={newEvent.link}
            onChange={e => onChange("link", e.target.value)}
          />
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
