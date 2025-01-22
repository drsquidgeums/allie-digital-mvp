import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { connectToTeams } from "@/utils/teamsIntegration";
import { useToast } from "@/hooks/use-toast";
import { IntegrationItem } from "./integration/IntegrationItem";

export const IntegrationSettings = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleTeamsConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToTeams();
      toast({
        title: "Microsoft Teams",
        description: "Successfully initiated Teams connection. Please complete authentication in the popup window.",
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to Microsoft Teams. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const integrations = [
    {
      title: "Google Calendar",
      description: "Sync tasks with Google Calendar",
    },
    {
      title: "Microsoft Teams",
      description: "Connect to Teams chat channels for collaborative discussions",
      onClick: handleTeamsConnect,
      isLoading: isConnecting,
    },
    {
      title: "Slack",
      description: "Connect with Slack workspace",
    },
    {
      title: "Canvas LMS",
      description: "Sync with your Canvas courses and assignments",
    },
    {
      title: "Google Classroom",
      description: "Connect and sync with Google Classroom",
    },
    {
      title: "Blackboard",
      description: "Sync with Blackboard courses and assignments",
    },
    {
      title: "Trello",
      description: "Sync tasks with Trello boards",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Integrations</h3>
      <div className="space-y-6">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.title}
            title={integration.title}
            description={integration.description}
            isLoading={integration.isLoading}
            onClick={integration.onClick}
          />
        ))}
      </div>
      <Separator />
    </div>
  );
};