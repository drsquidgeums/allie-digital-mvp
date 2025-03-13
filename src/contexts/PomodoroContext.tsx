
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { emitTaskNotification } from "@/utils/notifications";

interface PomodoroState {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  minutes: number;
  seconds: number;
  currentTask: string | null;
  isActive: boolean;
  isWork: boolean;
  completedPomodoros: number;
  sessionGoal: number;
  taskPomodoros: Record<string, number>; // Track pomodoros per task
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
  | { type: 'SWITCH_TO_BREAK' }
  | { type: 'SWITCH_TO_WORK' }
  | { type: 'SET_SESSION_GOAL'; payload: number };

const initialState: PomodoroState = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  minutes: 25,
  seconds: 0,
  currentTask: null,
  isActive: false,
  isWork: true,
  completedPomodoros: 0,
  sessionGoal: 4,
  taskPomodoros: {},
};

const pomodoroReducer = (state: PomodoroState, action: PomodoroAction): PomodoroState => {
  switch (action.type) {
    case 'SET_WORK_MINUTES':
      return { 
        ...state, 
        workMinutes: action.payload,
        minutes: state.isWork ? action.payload : state.minutes 
      };
    case 'SET_SHORT_BREAK':
      return { 
        ...state, 
        shortBreakMinutes: action.payload,
        minutes: (!state.isWork && state.completedPomodoros % 4 !== 0) ? action.payload : state.minutes
      };
    case 'SET_LONG_BREAK':
      return { 
        ...state, 
        longBreakMinutes: action.payload,
        minutes: (!state.isWork && state.completedPomodoros % 4 === 0) ? action.payload : state.minutes
      };
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    case 'TOGGLE_TIMER':
      return { ...state, isActive: !state.isActive };
    case 'RESET_TIMER':
      return {
        ...state, 
        minutes: state.isWork ? state.workMinutes : 
          (state.completedPomodoros % 4 === 0 ? state.longBreakMinutes : state.shortBreakMinutes),
        seconds: 0,
        isActive: false
      };
    case 'TICK':
      if (state.seconds > 0) {
        return { ...state, seconds: state.seconds - 1 };
      }
      
      if (state.minutes > 0) {
        return { ...state, minutes: state.minutes - 1, seconds: 59 };
      }
      
      // Timer has reached 00:00
      return {
        ...state,
        isActive: false
      };
    case 'COMPLETE_POMODORO':
      if (!state.currentTask) {
        return { 
          ...state, 
          completedPomodoros: state.completedPomodoros + 1,
          isWork: false,
          minutes: (state.completedPomodoros + 1) % 4 === 0 ? state.longBreakMinutes : state.shortBreakMinutes,
          seconds: 0
        };
      }
      
      const newTaskPomodoros = {
        ...state.taskPomodoros,
        [state.currentTask]: (state.taskPomodoros[state.currentTask] || 0) + 1
      };
      
      return {
        ...state,
        completedPomodoros: state.completedPomodoros + 1,
        isWork: false,
        minutes: (state.completedPomodoros + 1) % 4 === 0 ? state.longBreakMinutes : state.shortBreakMinutes,
        seconds: 0,
        taskPomodoros: newTaskPomodoros,
      };
    case 'SWITCH_TO_BREAK':
      return {
        ...state,
        isWork: false,
        minutes: state.completedPomodoros % 4 === 0 ? state.longBreakMinutes : state.shortBreakMinutes,
        seconds: 0
      };
    case 'SWITCH_TO_WORK':
      return {
        ...state,
        isWork: true,
        minutes: state.workMinutes,
        seconds: 0
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
  const { handleToggleTask } = useTasks();
  
  const notificationSound = useMemo(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/notification-bell.mp3');
      audio.volume = 0.5;
      return audio;
    }
    return null;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isActive]);

  // Handle timer completion
  useEffect(() => {
    if (state.minutes === 0 && state.seconds === 0 && !state.isActive) {
      // Play notification sound
      if (notificationSound) {
        notificationSound.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }

      if (state.isWork) {
        // Work session completed
        dispatch({ type: 'COMPLETE_POMODORO' });
        
        if (state.currentTask && (state.taskPomodoros[state.currentTask] || 0) >= 3) {
          // Task is completed after 4 pomodoros
          handleToggleTask(state.currentTask);
          toast({
            title: "Task completed!",
            description: "You've completed all pomodoros for this task!",
          });
          emitTaskNotification("Task completed!", "You've completed all pomodoros for this task!");
        } else {
          // Regular break time
          toast({
            title: "Pomodoro completed!",
            description: (state.completedPomodoros + 1) % 4 === 0 
              ? "Time for a long break!" 
              : "Time for a short break!",
          });
          emitTaskNotification("Pomodoro completed!", 
            (state.completedPomodoros + 1) % 4 === 0 
              ? "Time for a long break!" 
              : "Time for a short break!");
        }
      } else {
        // Break completed, ready for work
        dispatch({ type: 'SWITCH_TO_WORK' });
        toast({
          title: "Break time's over!",
          description: "Ready to start another Pomodoro?",
        });
        emitTaskNotification("Break time's over!", "Ready to start another Pomodoro?");
      }
    }
  }, [state.minutes, state.seconds, state.isActive, state.isWork, state.completedPomodoros, 
      state.currentTask, state.taskPomodoros, handleToggleTask, toast, notificationSound]);

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
