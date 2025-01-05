import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PomodoroState {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  currentTask: string | null;
  isActive: boolean;
  isWork: boolean;
  seconds: number;
  completedPomodoros: number;
  sessionGoal: number;
}

type PomodoroAction =
  | { type: 'SET_WORK_MINUTES'; payload: number }
  | { type: 'SET_SHORT_BREAK'; payload: number }
  | { type: 'SET_LONG_BREAK'; payload: number }
  | { type: 'SET_CURRENT_TASK'; payload: string | null }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_POMODORO' }
  | { type: 'SET_SESSION_GOAL'; payload: number };

const initialState: PomodoroState = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  currentTask: null,
  isActive: false,
  isWork: true,
  seconds: 0,
  completedPomodoros: 0,
  sessionGoal: 4,
};

const pomodoroReducer = (state: PomodoroState, action: PomodoroAction): PomodoroState => {
  switch (action.type) {
    case 'SET_WORK_MINUTES':
      return { ...state, workMinutes: action.payload };
    case 'SET_SHORT_BREAK':
      return { ...state, shortBreakMinutes: action.payload };
    case 'SET_LONG_BREAK':
      return { ...state, longBreakMinutes: action.payload };
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    case 'TOGGLE_TIMER':
      return { ...state, isActive: !state.isActive };
    case 'RESET_TIMER':
      return { 
        ...initialState,
        completedPomodoros: state.completedPomodoros,
        sessionGoal: state.sessionGoal
      };
    case 'TICK':
      if (state.seconds === 0) {
        if (state.workMinutes === 0) {
          return {
            ...state,
            isWork: !state.isWork,
            workMinutes: state.isWork ? 
              (state.completedPomodoros % 4 === 0 ? state.longBreakMinutes : state.shortBreakMinutes) : 
              initialState.workMinutes,
            isActive: false
          };
        }
        return { ...state, workMinutes: state.workMinutes - 1, seconds: 59 };
      }
      return { ...state, seconds: state.seconds - 1 };
    case 'COMPLETE_POMODORO':
      return { 
        ...state, 
        completedPomodoros: state.completedPomodoros + 1,
        currentTask: null
      };
    case 'SET_SESSION_GOAL':
      return { ...state, sessionGoal: action.payload };
    default:
      return state;
  }
};

const PomodoroContext = createContext<{
  state: PomodoroState;
  dispatch: React.Dispatch<PomodoroAction>;
} | null>(null);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const { toast } = useToast();
  const notificationSound = new Audio('/sounds/notification-bell.mp3');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isActive]);

  useEffect(() => {
    if (state.workMinutes === 0 && state.seconds === 0) {
      notificationSound.play().catch(console.error);
      if (state.isWork) {
        dispatch({ type: 'COMPLETE_POMODORO' });
        toast({
          title: "Pomodoro completed!",
          description: state.completedPomodoros % 4 === 0 
            ? "Time for a long break!" 
            : "Time for a short break!",
        });
      } else {
        toast({
          title: "Break time's over!",
          description: "Ready to start another Pomodoro?",
        });
      }
    }
  }, [state.workMinutes, state.seconds, state.isWork, state.completedPomodoros, toast]);

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
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