
import React from "react";
import { PomodoroSettings } from "./pomodoro/PomodoroSettings";
import { TaskSelector } from "./pomodoro/TaskSelector";
import { TimerDisplay } from "./pomodoro/TimerDisplay";
import { TimerControls } from "./pomodoro/TimerControls";
import { TaskCompletionPrompt } from "./pomodoro/TaskCompletionPrompt";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useBreakReminders } from "@/hooks/useBreakReminders";
import { useUserAnalytics } from "@/hooks/useUserAnalytics";

export const PomodoroTimer = () => {
  const { taskReadyForCompletion } = usePomodoroContext();
  const { trackToolUsage } = useUserAnalytics();
  
  // Enable break reminders
  useBreakReminders();
  
  React.useEffect(() => {
    trackToolUsage('pomodoro_timer');
  }, [trackToolUsage]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
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
