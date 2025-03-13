
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PomodoroSettings } from "./pomodoro/PomodoroSettings";
import { TaskSelector } from "./pomodoro/TaskSelector";
import { TimerDisplay } from "./pomodoro/TimerDisplay";
import { TimerControls } from "./pomodoro/TimerControls";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";

export const PomodoroTimer = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Pomodoro Timer</CardTitle>
            <Badge variant="outline" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Focus Tool
            </Badge>
          </div>
          <CardDescription>
            Focus on your tasks with timed work sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TimerDisplay />
          <TimerControls />
          <TaskSelector />
          <PomodoroSettings />
        </CardContent>
      </Card>
    </div>
  );
};
