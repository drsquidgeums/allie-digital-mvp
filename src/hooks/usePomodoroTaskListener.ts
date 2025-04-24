
import { useEffect } from 'react';
import { useTasks } from './useTasks';

export const usePomodoroTaskListener = () => {
  const { handleToggleTask } = useTasks();
  
  useEffect(() => {
    const handlePomodoroTaskCompletion = (event: CustomEvent) => {
      if (event.detail?.taskId) {
        handleToggleTask(event.detail.taskId);
      }
    };
    
    window.addEventListener(
      'pomodoroTaskCompletion', 
      handlePomodoroTaskCompletion as EventListener
    );
    
    return () => {
      window.removeEventListener(
        'pomodoroTaskCompletion', 
        handlePomodoroTaskCompletion as EventListener
      );
    };
  }, [handleToggleTask]);
};
