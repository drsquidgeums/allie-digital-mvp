
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PomodoroState } from "@/types/pomodoro";
import { emitTaskNotification } from "@/utils/notifications";

export const usePomodoroEvents = (
  state: PomodoroState,
  setTaskReadyForCompletion: (taskId: string | null) => void,
  notificationSound: HTMLAudioElement
) => {
  const { toast } = useToast();

  // Timer completion effect
  useEffect(() => {
    if (state.workMinutes === 0 && state.seconds === 0) {
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
    }
  }, [state.workMinutes, state.seconds, state.isWork, state.completedPomodoros, state.currentTask, state.taskPomodoros, toast, notificationSound, setTaskReadyForCompletion]);

  // Task completion event handler - setup only
  useEffect(() => {
    const handleTaskCompletion = (event: CustomEvent) => {
      if (event.detail?.action === 'complete' && event.detail?.taskId) {
        // Instead of calling useTasks directly, we'll emit an event that will be handled elsewhere
        const taskCompletionEvent = new CustomEvent('pomodoroTaskCompletion', { 
          detail: { taskId: event.detail.taskId }
        });
        window.dispatchEvent(taskCompletionEvent);
        
        setTaskReadyForCompletion(null);
        toast({
          title: "Task completed!",
          description: "Task has been marked as complete.",
        });
      }
    };

    window.addEventListener('taskCompletion' as any, handleTaskCompletion as EventListener);
    return () => {
      window.removeEventListener('taskCompletion' as any, handleTaskCompletion as EventListener);
    };
  }, [toast, setTaskReadyForCompletion]);
};
