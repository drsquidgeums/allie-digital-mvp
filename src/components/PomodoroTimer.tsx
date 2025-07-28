
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
import { useBreakReminders } from "@/hooks/useBreakReminders";

export const PomodoroTimer = () => {
  const { taskReadyForCompletion } = usePomodoroContext();
  
  // Enable break reminders
  useBreakReminders();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Pomodoro Timer</h2>
          <p className="text-muted-foreground">
            Focus on your tasks with timed work sessions and smart break reminders
          </p>
        </div>
        <div className="space-y-4">
          {taskReadyForCompletion && <TaskCompletionPrompt />}
          <PomodoroSettings />
          <TaskSelector />
          <TimerDisplay />
          <TimerControls />
        </div>
      </div>
    </div>
  );
};
