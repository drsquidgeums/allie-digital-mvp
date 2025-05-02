
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FocusButton } from "./focus/FocusButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Focus } from "lucide-react";

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
          <AlertTitle>Simple Focus Mode</AlertTitle>
          <AlertDescription>
            Click the focus button in the toolbar to toggle focus mode.
            This will block distractions and enter fullscreen mode.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FocusMode;
