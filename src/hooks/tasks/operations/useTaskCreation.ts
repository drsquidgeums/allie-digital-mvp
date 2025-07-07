
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const categories = ["work", "personal", "study", "health"];

export const useTaskCreation = (tasks: Task[], updateTasks: (tasks: Task[]) => void, getTaskPoints: (task: Task) => number) => {
  const handleAddTask = useCallback(async (text: string, taskDate?: Date) => {
    if (!text.trim()) {
      console.log('Empty task text, not adding');
      return;
    }
    
    console.log('Adding task:', text);
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Create the new task object
    const newTask: Task = {
      id: uuidv4(),
      text: text.trim(),
      completed: false,
      createdAt: taskDate || new Date(),
      points: 10, // Default points
      category: randomCategory,
      labels: []
    };

    // Set points using the getTaskPoints function
    newTask.points = getTaskPoints(newTask);

    try {
      console.log('Creating task locally:', newTask);
      
      // Add task to the beginning of the array to show newest first
      const updatedTasks = [newTask, ...tasks];
      updateTasks(updatedTasks);
      
      toast.success("Task added successfully!");
      console.log('Task added to local state, total tasks:', updatedTasks.length);
      
    } catch (err) {
      console.error('Unexpected error in handleAddTask:', err);
      toast.error("Failed to add task");
    }
  }, [tasks, updateTasks, getTaskPoints]);

  return { handleAddTask };
};
