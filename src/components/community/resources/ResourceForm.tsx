
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ResourceFormProps {
  newResource: {
    title: string;
    description: string;
    url: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

export const ResourceForm = ({ newResource, onSubmit, onChange }: ResourceFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <div>
        <Input
          placeholder="Resource Title"
          value={newResource.title}
          onChange={e => onChange("title", e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Resource Description"
          value={newResource.description}
          onChange={e => onChange("description", e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Resource URL"
          value={newResource.url}
          onChange={e => onChange("url", e.target.value)}
          className="mb-2"
        />
      </div>
      <Button type="submit" className="w-full">
        Share Resource
      </Button>
    </form>
  );
};
