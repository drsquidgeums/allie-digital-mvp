
import { useEffect } from 'react';
import { useToast } from './use-toast';
import { usePomodoroContext } from '@/contexts/PomodoroContext';

export const useBreakReminders = () => {
  const { state } = usePomodoroContext();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for Pomodoro completion events
    const handlePomodoroComplete = () => {
      if (state.isWork) {
        // Work session completed, time for break
        const isLongBreak = state.completedPomodoros % 4 === 0;
        
        toast({
          title: isLongBreak ? "Time for a long break!" : "Time for a short break!",
          description: isLongBreak 
            ? "You've earned a 15-minute break. Step away from the screen!"
            : "Take a 5-minute break. Stretch, hydrate, or rest your eyes.",
          duration: 10000,
        });

        // Send notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(isLongBreak ? 'Long Break Time!' : 'Short Break Time!', {
            body: isLongBreak 
              ? 'Take a 15-minute break and recharge'
              : 'Take a 5-minute break to stay fresh',
            icon: '/favicon.ico'
          });
        }
      } else {
        // Break completed, back to work
        toast({
          title: "Break's over!",
          description: "Ready to dive back into focused work?",
          duration: 5000,
        });
      }
    };

    // Check if timer just completed (reached 0:00)
    if (state.workMinutes === 0 && state.seconds === 0 && !state.isActive) {
      handlePomodoroComplete();
    }
  }, [state.workMinutes, state.seconds, state.isActive, state.isWork, state.completedPomodoros, toast]);

  return null;
};
