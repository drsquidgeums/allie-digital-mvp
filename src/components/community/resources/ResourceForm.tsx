
import React from "react";
import { Button } from "@/components/ui/button";
import { SecureInput } from "@/components/security/SecureInput";
import { textSchema, checkRateLimit } from "@/utils/inputValidation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const handleSecureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    try {
      textSchema.parse(newResource.title);
      textSchema.parse(newResource.description);
      
      // Basic URL validation
      if (newResource.url && !newResource.url.match(/^https?:\/\/.+/)) {
        toast.error("Please enter a valid URL starting with http:// or https://");
        return;
      }
    } catch {
      toast.error("Please enter valid information in all fields");
      return;
    }

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("You must be logged in to share resources");
      return;
    }

    // Rate limiting
    if (!checkRateLimit(`resource_${session.user.id}`, 5, 300000)) { // 5 resources per 5 minutes
      toast.error("Too many resources shared. Please wait a moment.");
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSecureSubmit} className="space-y-4 mb-6">
      <div>
        <SecureInput
          placeholder="Resource Title"
          value={newResource.title}
          onSecureChange={(value) => onChange("title", value)}
          className="mb-2"
          maxLength={200}
        />
        <SecureInput
          placeholder="Resource Description"
          value={newResource.description}
          onSecureChange={(value) => onChange("description", value)}
          className="mb-2"
          maxLength={500}
        />
        <SecureInput
          placeholder="Resource URL"
          value={newResource.url}
          onSecureChange={(value) => onChange("url", value)}
          className="mb-2"
          maxLength={500}
        />
      </div>
      <Button type="submit" className="w-full">
        Share Resource
      </Button>
    </form>
  );
};
