
import { PomodoroState, PomodoroAction } from "@/types/pomodoro";

export const initialState: PomodoroState = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  currentTask: null,
  isActive: false,
  isWork: true,
  seconds: 0,
  completedPomodoros: 0,
  sessionGoal: 4,
  taskPomodoros: {},
};

export const pomodoroReducer = (state: PomodoroState, action: PomodoroAction): PomodoroState => {
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
        sessionGoal: state.sessionGoal,
        taskPomodoros: state.taskPomodoros
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
      if (!state.currentTask) return { ...state, completedPomodoros: state.completedPomodoros + 1 };
      const newTaskPomodoros = {
        ...state.taskPomodoros,
        [state.currentTask]: (state.taskPomodoros[state.currentTask] || 0) + 1
      };
      return {
        ...state,
        completedPomodoros: state.completedPomodoros + 1,
        taskPomodoros: newTaskPomodoros,
      };
    case 'SET_SESSION_GOAL':
      return { ...state, sessionGoal: action.payload };
    default:
      return state;
  }
};
