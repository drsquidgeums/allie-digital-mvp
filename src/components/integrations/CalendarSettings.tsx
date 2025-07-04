
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarIntegration } from "@/hooks/integrations/useCalendarIntegration";

export const CalendarSettings = () => {
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const { scheduleStudySession, syncWithCalendar } = useCalendarIntegration();

  const handleScheduleSession = () => {
    if (sessionTitle && sessionDate && sessionTime) {
      const startDateTime = `${sessionDate}T${sessionTime}`;
      const endTime = new Date(startDateTime);
      endTime.setHours(endTime.getHours() + 1);
      
      scheduleStudySession({
        title: sessionTitle,
        start: startDateTime,
        end: endTime.toISOString(),
        description: 'Scheduled study session'
      });
      
      setSessionTitle('');
      setSessionDate('');
      setSessionTime('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Integration</CardTitle>
        <CardDescription>Schedule study sessions and sync with your calendar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => syncWithCalendar('google')}>
            Google Calendar
          </Button>
          <Button variant="outline" onClick={() => syncWithCalendar('outlook')}>
            Outlook
          </Button>
          <Button variant="outline" onClick={() => syncWithCalendar('apple')}>
            Apple Calendar
          </Button>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <Label>Schedule Study Session</Label>
          <Input
            placeholder="Session title"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
            <Input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />
          </div>
          <Button onClick={handleScheduleSession} className="w-full">
            Schedule Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
