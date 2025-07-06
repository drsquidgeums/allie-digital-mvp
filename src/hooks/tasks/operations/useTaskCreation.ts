
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";

const categories = ["work", "personal", "study", "health"];

export const useTaskCreation = (tasks: Task[], updateTasks: (tasks: Task[]) => void, getTaskPoints: (task: Task) => number) => {
  const handleAddTask = useCallback(async (text: string, taskDate: Date) => {
    if (!text.trim()) return;
    
    console.log('Adding task:', text);
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Create the new task object first
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: taskDate || new Date(),
      points: 10, // Default points
      category: randomCategory
    };

    // Set points using the getTaskPoints function
    newTask.points = getTaskPoints(newTask);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await extendedSupabase.auth.getUser();
      
      console.log('Auth check - User:', user?.id, 'Error:', userError);
      
      // If no user is authenticated, add task locally
      if (userError || !user) {
        console.log('No authenticated user, adding task locally');
        
        // Add task to the beginning of the array to show newest first
        const updatedTasks = [newTask, ...tasks];
        updateTasks(updatedTasks);
        toast.success("Task added (stored locally)");
        return;
      }
      
      // User is authenticated, try to save to database
      console.log('User authenticated, saving to database...');
      
      const { data, error } = await extendedSupabase
        .from('tasks')
        .insert({
          user_id: user.id,
          text: newTask.text,
          completed: newTask.completed,
          created_at: newTask.createdAt.toISOString(),
          points: newTask.points,
          category: newTask.category
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        
        // Fallback to local storage
        const updatedTasks = [newTask, ...tasks];
        updateTasks(updatedTasks);
        toast.success("Task added locally (database unavailable)");
        return;
      }

      if (data) {
        console.log('Task saved to database:', data);
        
        // Create task object from database response
        const savedTask: Task = {
          id: data.id,
          text: data.text,
          completed: data.completed || false,
          createdAt: new Date(data.created_at as string),
          points: data.points || 10,
          color: data.color as string | undefined,
          category: data.category as string | undefined
        };

        // Add to local state (database realtime will also update, but this is immediate)
        const updatedTasks = [savedTask, ...tasks];
        updateTasks(updatedTasks);
        toast.success("Task added successfully");
      }
      
    } catch (err) {
      console.error('Unexpected error in handleAddTask:', err);
      
      // Always fallback to local storage on any error
      const updatedTasks = [newTask, ...tasks];
      updateTasks(updatedTasks);
      toast.success("Task added locally");
    }
  }, [tasks, updateTasks, getTaskPoints]);

  return { handleAddTask };
};
