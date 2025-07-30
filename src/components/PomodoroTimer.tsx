
import React from "react";
import { PomodoroSettings } from "./pomodoro/PomodoroSettings";
import { TaskSelector } from "./pomodoro/TaskSelector";
import { TimerDisplay } from "./pomodoro/TimerDisplay";
import { TimerControls } from "./pomodoro/TimerControls";
import { TaskCompletionPrompt } from "./pomodoro/TaskCompletionPrompt";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useBreakReminders } from "@/hooks/useBreakReminders";
import { useUserAnalytics } from "@/hooks/useUserAnalytics";
import { AIRecommendations } from "@/components/AIRecommendations";

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
        
        {/* AI Recommendations sidebar */}
        <div className="lg:col-span-1">
          <AIRecommendations />
        </div>
      </div>
    </div>
  );
};
