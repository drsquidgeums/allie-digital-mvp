
import React from "react";
import { Timer } from "lucide-react";
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
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4" />
        <h3 className="font-medium">Pomodoro Timer</h3>
      </div>
      
      {taskReadyForCompletion && <TaskCompletionPrompt />}
      
      <TimerDisplay />
      <TimerControls />
      <TaskSelector />
      <PomodoroSettings />
    </div>
  );
};
