
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCloudSync } from "@/hooks/integrations/useCloudSync";

export const CloudSyncSettings = () => {
  const { providers, connectProvider, syncFiles } = useCloudSync();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Storage Integration</CardTitle>
        <CardDescription>Connect your cloud storage accounts for file synchronization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.name} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <span className="font-medium">{provider.name}</span>
              <Badge variant={provider.connected ? "default" : "secondary"}>
                {provider.connected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => connectProvider(provider.name)}
              >
                {provider.connected ? "Reconnect" : "Connect"}
              </Button>
              {provider.connected && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => syncFiles(provider.name)}
                >
                  Sync Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
