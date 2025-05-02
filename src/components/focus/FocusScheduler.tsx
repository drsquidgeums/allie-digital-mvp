
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";
import { Settings } from "lucide-react";

export const FocusScheduler: React.FC = () => {
  const [minutes, setMinutes] = useState(5);
  const { scheduleFocusSession } = useFocusModeControl();
  
  const handleSchedule = () => {
    scheduleFocusSession(minutes);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Schedule Focus Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="delay">Start in (minutes)</Label>
            <div className="flex gap-2">
              <Input
                id="delay"
                type="number"
                min={1}
                max={60}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
              <Button onClick={handleSchedule}>Schedule</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setMinutes(5)}>
              5 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMinutes(10)}>
              10 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMinutes(15)}>
              15 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMinutes(30)}>
              30 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMinutes(45)}>
              45 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMinutes(60)}>
              60 min
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
