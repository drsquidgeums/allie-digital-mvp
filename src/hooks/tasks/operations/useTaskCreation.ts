
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

const categories = ["work", "personal", "study", "health"];

export const useTaskCreation = (tasks: Task[], updateTasks: (tasks: Task[]) => void, getTaskPoints: (task: Task) => number) => {
  const handleAddTask = useCallback(async (text: string, taskDate?: Date) => {
    if (!text.trim()) {
      console.log('Empty task text, not adding');
      return;
    }
    
    console.log('Adding task:', text);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user, cannot add task');
      toast.error("Please sign in to add tasks");
      return;
    }
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const taskId = uuidv4();
    const createdAt = taskDate || new Date();
    
    // Create the new task object for local state
    const newTask: Task = {
      id: taskId,
      text: text.trim(),
      completed: false,
      createdAt: createdAt,
      points: 10, // Default points
      category: randomCategory,
      labels: []
    };

    // Set points using the getTaskPoints function
    newTask.points = getTaskPoints(newTask);

    try {
      console.log('Creating task in Supabase:', newTask);
      
      // Insert into Supabase
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: taskId,
          user_id: user.id,
          text: text.trim(),
          completed: false,
          created_at: createdAt.toISOString(),
          points: newTask.points,
          category: randomCategory,
          color: null,
          labels: []
        });

      if (error) {
        console.error('Error creating task in Supabase:', error);
        toast.error("Failed to add task");
        return;
      }
      
      // Add task to the beginning of the array to show newest first
      const updatedTasks = [newTask, ...tasks];
      updateTasks(updatedTasks);
      
      toast.success("Task added successfully!");
      console.log('Task added to Supabase, total tasks:', updatedTasks.length);
      
    } catch (err) {
      console.error('Unexpected error in handleAddTask:', err);
      toast.error("Failed to add task");
    }
  }, [tasks, updateTasks, getTaskPoints]);

  return { handleAddTask };
};
