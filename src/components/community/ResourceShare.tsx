
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ResourceForm } from "./resources/ResourceForm";
import { ResourceCard } from "./resources/ResourceCard";
import { EventDialog } from "./resources/EventDialog";
import { EventList } from "./resources/EventList";

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

const ResourceShare = () => {
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
      date: new Date(Date.now() - 86400000)
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

  const handleResourceChange = (field: string, value: string) => {
    setNewResource(prev => ({ ...prev, [field]: value }));
  };

  const handleEventChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
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
      
      <ResourceForm
        newResource={newResource}
        onSubmit={handleSubmit}
        onChange={handleResourceChange}
      />

      <div className="border rounded-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Study Group Calendar
          </h3>
          <EventDialog
            newEvent={newEvent}
            onChange={handleEventChange}
            onSubmit={handleCreateEvent}
          />
        </div>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">
              Events on {selectedDate.toLocaleDateString()}
            </h4>
            <EventList events={selectedDateEvents} />
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onRate={handleRate}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ResourceShare;
