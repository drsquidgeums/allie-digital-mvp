
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Star, Plus, FileText, Video, Link } from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Calculus Study Guide",
    type: "PDF",
    author: "Dr. Johnson",
    rating: 4.8,
    downloads: 234,
    category: "Math",
    icon: FileText
  },
  {
    id: 2,
    title: "Physics Lab Walkthrough",
    type: "Video",
    author: "Prof. Lee",
    rating: 4.9,
    downloads: 456,
    category: "Science",
    icon: Video
  },
  {
    id: 3,
    title: "Writing Tips Collection",
    type: "Link",
    author: "Ms. Davis",
    rating: 4.7,
    downloads: 123,
    category: "English",
    icon: Link
  }
];

export const VisualResources = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resources</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="grid gap-3">
        {resources.map((resource) => {
          const IconComponent = resource.icon;
          return (
            <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{resource.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      {resource.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      by {resource.author}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Download className="h-4 w-4" />
                        {resource.downloads}
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
