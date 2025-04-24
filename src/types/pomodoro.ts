
export interface PomodoroState {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  currentTask: string | null;
  isActive: boolean;
  isWork: boolean;
  seconds: number;
  completedPomodoros: number;
  sessionGoal: number;
  taskPomodoros: Record<string, number>;
}

export type PomodoroAction =
  | { type: 'SET_WORK_MINUTES'; payload: number }
  | { type: 'SET_SHORT_BREAK'; payload: number }
  | { type: 'SET_LONG_BREAK'; payload: number }
  | { type: 'SET_CURRENT_TASK'; payload: string | null }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_POMODORO' }
  | { type: 'SET_SESSION_GOAL'; payload: number };

export interface PomodoroContextValue {
  state: PomodoroState;
  dispatch: React.Dispatch<PomodoroAction>;
  taskReadyForCompletion: string | null;
  setTaskReadyForCompletion: (taskId: string | null) => void;
}
