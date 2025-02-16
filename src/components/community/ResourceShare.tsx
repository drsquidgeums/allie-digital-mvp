
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, Link, FileText, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  rating: number;
  author: string;
}

export const ResourceShare = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "Effective Study Techniques",
      description: "A comprehensive guide to improving study habits",
      url: "https://example.com/study-guide",
      category: "Study Guide",
      rating: 4.5,
      author: "Maria K."
    },
    {
      id: "2",
      title: "Focus Mode Template",
      description: "Custom template for maximizing focus sessions",
      url: "https://example.com/focus-template",
      category: "Template",
      rating: 5,
      author: "Alex B."
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
      author: "Current User"
    };

    setResources(prev => [resource, ...prev]);
    setNewResource({ title: "", description: "", url: "" });
    toast({
      title: "Resource Shared",
      description: "Your resource has been shared with the community"
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
          />
        </div>
        <Button type="submit" className="w-full">
          Share Resource
        </Button>
      </form>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {resources.map(resource => (
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
                <span>Shared by {resource.author}</span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
