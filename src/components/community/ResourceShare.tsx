import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, Link, FileText, Star, Calendar, UserPlus, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  rating: number;
  author: string;
  date?: Date;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  invitees: string[];
  link?: string;
}

export const ResourceShare = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    invitees: "",
    link: ""
  });
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "Effective Study Techniques",
      description: "A comprehensive guide to improving study habits",
      url: "https://example.com/study-guide",
      category: "Study Guide",
      rating: 4.5,
      author: "Maria K.",
      date: new Date()
    },
    {
      id: "2",
      title: "Focus Mode Template",
      description: "Custom template for maximizing focus sessions",
      url: "https://example.com/focus-template",
      category: "Template",
      rating: 5,
      author: "Alex B.",
      date: new Date(Date.now() - 86400000) // Yesterday
    }
  ]);

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    url: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const resource: Resource = {
      id: Date.now().toString(),
      ...newResource,
      category: "Study Resource",
      rating: 0,
      author: "Current User",
      date: selectedDate || new Date()
    };

    setResources(prev => [resource, ...prev]);
    setNewResource({ title: "", description: "", url: "" });
    toast({
      title: "Resource Shared",
      description: "Your resource has been shared with the community"
    });
  };

  const handleCreateEvent = () => {
    if (!selectedDate || !newEvent.title) {
      toast({
        title: "Required Fields Missing",
        description: "Please select a date and enter an event title",
        variant: "destructive"
      });
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      invitees: newEvent.invitees.split(',').map(email => email.trim()),
      link: newEvent.link
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      description: "",
      invitees: "",
      link: ""
    });

    toast({
      title: "Event Created",
      description: "Your event has been scheduled and invitations will be sent"
    });
  };

  const handleRate = (id: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id
          ? { ...resource, rating: Math.min(5, resource.rating + 1) }
          : resource
      )
    );
    toast({
      title: "Resource Rated",
      description: "Thank you for rating this resource"
    });
  };

  const filteredResources = selectedDate 
    ? resources.filter(resource => 
        resource.date && 
        resource.date.toDateString() === selectedDate.toDateString()
      )
    : resources;

  const selectedDateEvents = events.filter(
    event => event.date.toDateString() === selectedDate?.toDateString()
  );

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Share Resources</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Input
            placeholder="Resource Title"
            value={newResource.title}
            onChange={e => setNewResource(prev => ({ ...prev, title: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="Resource Description"
            value={newResource.description}
            onChange={e => setNewResource(prev => ({ ...prev, description: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="Resource URL"
            value={newResource.url}
            onChange={e => setNewResource(prev => ({ ...prev, url: e.target.value }))}
            className="mb-2"
          />
        </div>
        <Button type="submit" className="w-full">
          Share Resource
        </Button>
      </form>

      <div className="border rounded-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Study Group Calendar
          </h3>
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
                  onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea 
                  placeholder="Event Description"
                  value={newEvent.description}
                  onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />
                <Input
                  placeholder="Meeting Link (optional)"
                  value={newEvent.link}
                  onChange={e => setNewEvent(prev => ({ ...prev, link: e.target.value }))}
                />
                <div>
                  <label className="text-sm text-muted-foreground">
                    Invite Users (comma-separated emails)
                  </label>
                  <Input
                    placeholder="user@example.com, user2@example.com"
                    value={newEvent.invitees}
                    onChange={e => setNewEvent(prev => ({ ...prev, invitees: e.target.value }))}
                  />
                </div>
                <Button onClick={handleCreateEvent} className="w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Events on {selectedDate.toLocaleDateString()}</h4>
            {selectedDateEvents.map(event => (
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
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="p-4 bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    View Resource
                  </a>
                </div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRate(resource.id)}
                    className="text-yellow-500"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {resource.rating.toFixed(1)}
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {resource.category}
                </span>
                <div className="flex items-center gap-2">
                  <span>{resource.author}</span>
                  {resource.date && (
                    <span className="text-xs">
                      {resource.date.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
