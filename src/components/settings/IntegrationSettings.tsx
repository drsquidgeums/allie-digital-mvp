import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { connectToTeams } from "@/utils/teamsIntegration";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Integrations</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Google Calendar</Label>
            <p className="text-sm text-muted-foreground">Sync tasks with Google Calendar</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Microsoft Teams</Label>
            <p className="text-sm text-muted-foreground">Connect to Teams chat channels for collaborative discussions</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTeamsConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Slack</Label>
            <p className="text-sm text-muted-foreground">Connect with Slack workspace</p>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Canvas LMS</Label>
            <p className="text-sm text-muted-foreground">Sync with your Canvas courses and assignments</p>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Google Classroom</Label>
            <p className="text-sm text-muted-foreground">Connect and sync with Google Classroom</p>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Blackboard</Label>
            <p className="text-sm text-muted-foreground">Sync with Blackboard courses and assignments</p>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Trello</Label>
            <p className="text-sm text-muted-foreground">Sync tasks with Trello boards</p>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};
