
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FocusButton } from "./focus/FocusButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Focus } from "lucide-react";
import { FocusSettingsPanel } from "./focus/FocusSettingsPanel";
import { FocusStatsPanel } from "./focus/FocusStatsPanel";
import { FocusScheduler } from "./focus/FocusScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FocusMode = () => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Focus Mode</h3>
          <FocusButton />
        </div>
        
        <Alert>
          <Focus className="h-4 w-4" />
          <AlertTitle>Enhanced Focus Mode</AlertTitle>
          <AlertDescription>
            Customize your focus environment, track your sessions, and schedule focused work time.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-0">
            <FocusSettingsPanel />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <FocusStatsPanel />
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-0">
            <FocusScheduler />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FocusMode;
