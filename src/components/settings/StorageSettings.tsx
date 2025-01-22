import React from "react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const StorageSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Data & Storage</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Storage Usage</Label>
            <span className="text-sm text-muted-foreground">2.1 GB / 5 GB</span>
          </div>
          <Progress value={42} />
        </div>

        <div className="space-y-2">
          <Label>Cache Management</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Clear Cache</Button>
            <Button variant="outline" size="sm">Clear Local Storage</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Export Data</Label>
          <Button variant="outline" size="sm">Download My Data</Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};