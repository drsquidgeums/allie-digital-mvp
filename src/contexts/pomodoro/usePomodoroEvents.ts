import { useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PomodoroState } from "@/types/pomodoro";
import { emitTaskNotification } from "@/utils/notifications";

export const usePomodoroEvents = (
  state: PomodoroState,
  setTaskReadyForCompletion: (taskId: string | null) => void,
  notificationSound: HTMLAudioElement
) => {
  const { toast } = useToast();

  // Handle timer completion logic
  const handleTimerCompletion = useCallback(() => {
    notificationSound.volume = 0.5;
    notificationSound.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });

    if (state.isWork) {
      if (state.currentTask && (state.taskPomodoros[state.currentTask] || 0) >= 4) {
        setTaskReadyForCompletion(state.currentTask);
        
        toast({
          title: "Task ready for completion",
          description: "You've completed all pomodoros for this task! Would you like to mark it as complete?",
        });

        emitTaskNotification(
          "Pomodoro Complete",
          "You've completed all pomodoros for this task! Mark it as complete?",
          state.currentTask,
          'complete'
        );
      } else {
        toast({
          title: "Pomodoro completed!",
          description: state.completedPomodoros % 4 === 0 
            ? "Time for a long break!" 
            : "Time for a short break!",
        });
      }
    } else {
      toast({
        title: "Break time's over!",
        description: "Ready to start another Pomodoro?",
      });
    }
  }, [
    state.isWork, 
    state.completedPomodoros, 
    state.currentTask, 
    state.taskPomodoros, 
    toast, 
    notificationSound, 
    setTaskReadyForCompletion
  ]);

  // Timer completion effect
  useEffect(() => {
    if (state.workMinutes === 0 && state.seconds === 0) {
      handleTimerCompletion();
    }
  }, [state.workMinutes, state.seconds, handleTimerCompletion]);
};
