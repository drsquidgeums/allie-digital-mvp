
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Link, FileText, Star } from "lucide-react";

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

interface ResourceCardProps {
  resource: Resource;
  onRate: (id: string) => void;
}

export const ResourceCard = ({ resource, onRate }: ResourceCardProps) => {
  return (
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
            onClick={() => onRate(resource.id)}
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
  );
};
