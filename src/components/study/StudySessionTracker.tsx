
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, BookOpen, Edit } from "lucide-react";
import { useStudySessionTracker } from "@/hooks/useStudySessionTracker";

interface StudySessionTrackerProps {
  documentName?: string;
}

export const StudySessionTracker: React.FC<StudySessionTrackerProps> = ({
  documentName = 'Current Document'
}) => {
  const {
    isTracking,
    currentSession,
    totalTimeToday,
    startSession,
    endSession,
    formatTime
  } = useStudySessionTracker(documentName);

  const dailyGoal = 3600; // 1 hour in seconds
  const progressPercentage = Math.min((totalTimeToday / dailyGoal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Study Session Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Session</span>
            {currentSession && (
              <Badge variant="outline">
                {currentSession.type === 'reading' ? (
                  <BookOpen className="h-3 w-3 mr-1" />
                ) : (
                  <Edit className="h-3 w-3 mr-1" />
                )}
                {currentSession.type}
              </Badge>
            )}
          </div>
          
          <div className="text-2xl font-bold">
            {currentSession ? formatTime(currentSession.duration) : '00:00'}
          </div>
          
          <div className="flex gap-2">
            {!isTracking ? (
              <>
                <Button
                  onClick={() => startSession('reading')}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start Reading
                </Button>
                <Button
                  onClick={() => startSession('editing')}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Start Editing
                </Button>
              </>
            ) : (
              <Button
                onClick={endSession}
                size="sm"
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-1" />
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Daily Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              {formatTime(totalTimeToday)} / {formatTime(dailyGoal)}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Daily goal: 1 hour of focused study time
          </p>
        </div>

        {/* Document Info */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Tracking: <span className="font-medium">{documentName}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
