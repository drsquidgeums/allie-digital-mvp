
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
import { TaskCompletionPrompt } from "./pomodoro/TaskCompletionPrompt";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const PomodoroTimer = () => {
  const { taskReadyForCompletion } = usePomodoroContext();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            Focus on your tasks with timed work sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taskReadyForCompletion && <TaskCompletionPrompt />}
          <PomodoroSettings />
          <TaskSelector />
          <TimerDisplay />
          <TimerControls />
        </CardContent>
      </Card>
    </div>
  );
};
