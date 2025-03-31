
import { useState, useEffect } from "react";
import { Task } from "@/types/task";

// Shared state for tasks
let sharedTasks: Task[] = [];
const listeners = new Set<(tasks: Task[]) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(sharedTasks));
};

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>(sharedTasks);

  useEffect(() => {
    const listener = (newTasks: Task[]) => {
      setTasks(newTasks);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    sharedTasks = newTasks;
    notifyListeners();
  };

  return {
    tasks,
    updateTasks
  };
};
