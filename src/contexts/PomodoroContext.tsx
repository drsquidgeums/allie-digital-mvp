
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { PomodoroContextValue, PomodoroState } from '@/types/pomodoro';
import { pomodoroReducer, initialState } from './pomodoro/pomodoroReducer';
import { usePomodoroEvents } from './pomodoro/usePomodoroEvents';

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const [taskReadyForCompletion, setTaskReadyForCompletion] = useState<string | null>(null);
  const notificationSound = new Audio('/sounds/notification-bell.mp3');

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isActive]);

  // Setup event handlers
  usePomodoroEvents(state, setTaskReadyForCompletion, notificationSound);

  return (
    <PomodoroContext.Provider value={{ state, dispatch, taskReadyForCompletion, setTaskReadyForCompletion }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
};
