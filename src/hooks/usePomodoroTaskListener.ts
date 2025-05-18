
import { useEffect } from 'react';
import { useTasks } from './useTasks';
import { useToast } from './use-toast';

export const usePomodoroTaskListener = () => {
  const { handleToggleTask } = useTasks();
  const { toast } = useToast();
  
  useEffect(() => {
    const handlePomodoroTaskCompletion = (event: CustomEvent) => {
      if (event.detail?.taskId) {
        const taskId = event.detail.taskId;
        console.log('Pomodoro task completion event received for task:', taskId);
        handleToggleTask(taskId);
        toast({
          title: "Task completed via Pomodoro!",
          description: "The task has been marked as complete.",
        });
      }
    };
    
    window.addEventListener(
      'pomodoroTaskCompletion', 
      handlePomodoroTaskCompletion as EventListener
    );
    
    console.log('Pomodoro task listener initialized');
    
    return () => {
      window.removeEventListener(
        'pomodoroTaskCompletion', 
        handlePomodoroTaskCompletion as EventListener
      );
    };
  }, [handleToggleTask, toast]);
};
