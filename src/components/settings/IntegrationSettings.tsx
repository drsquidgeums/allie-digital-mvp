import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const IntegrationSettings = () => {
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
            <p className="text-sm text-muted-foreground">Enable Teams notifications</p>
          </div>
          <Switch />
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