
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from 'uuid';

// Simple local storage key
const TASKS_STORAGE_KEY = 'local_tasks';

// Load tasks from localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((task: any) => {
        // Migrate old timestamp-based IDs to UUIDs and ensure labels exist
        const migratedTask: Task = {
          ...task,
          createdAt: new Date(task.createdAt),
          id: task.id && task.id.length > 20 ? task.id : uuidv4(), // Keep UUID, replace timestamp IDs
          labels: task.labels || [] // Ensure labels array exists
        };
        return migratedTask;
      });
    }
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
  }
  return [];
};

// Save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    console.log('Tasks saved to localStorage:', tasks.length);
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    console.log('Loading tasks from localStorage...');
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
    setLoading(false);
    console.log('Loaded tasks:', loadedTasks.length);
  }, []);

  const updateTasks = async (newTasks: Task[]) => {
    console.log('updateTasks called with:', newTasks.length, 'tasks');
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  };

  return {
    tasks,
    loading,
    updateTasks
  };
};
