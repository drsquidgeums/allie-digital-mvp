
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { formatDistanceToNow } from "date-fns";
import { Timer } from "lucide-react";

export const FocusStatsPanel: React.FC = () => {
  const { getSessionStats } = useFocusSettings();
  const stats = getSessionStats();
  
  // Format time in hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Calculate completion rate
  const completionRate = stats.totalSessions > 0 
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0;
    
  // Get recent sessions
  const recentSessions = [...stats.sessions].reverse().slice(0, 5);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-4 w-4" />
          Focus Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{stats.completedSessions}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Focus Time</p>
            <p className="text-2xl font-bold">{formatTime(stats.totalFocusTime)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
            <p className="text-2xl font-bold">{formatTime(stats.averageSessionLength)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        {recentSessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Sessions</h4>
            <div className="space-y-2">
              {recentSessions.map((session, i) => (
                <div key={i} className="text-sm flex justify-between items-center">
                  <span>
                    {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                  </span>
                  <span className={`font-medium ${session.completed ? 'text-green-500' : 'text-amber-500'}`}>
                    {formatTime(session.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
