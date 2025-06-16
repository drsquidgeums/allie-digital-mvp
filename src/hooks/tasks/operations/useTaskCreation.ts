
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";

const categories = ["work", "personal", "study", "health"];

export const useTaskCreation = (tasks: Task[], updateTasks: (tasks: Task[]) => void, getTaskPoints: (task: Task) => number) => {
  const handleAddTask = useCallback(async (text: string, taskDate: Date) => {
    if (!text.trim()) return;
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const newTask = {
      id: Date.now().toString(), // Temporary ID
      text,
      completed: false,
      createdAt: taskDate || new Date(),
      points: getTaskPoints({ 
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: taskDate || new Date(),
        points: 10,
        category: randomCategory
      }),
      category: randomCategory
    };

    try {
      // Insert task into Supabase
      const { data, error } = await extendedSupabase
        .from('tasks')
        .insert({
          text: newTask.text,
          completed: newTask.completed,
          created_at: newTask.createdAt.toISOString(),
          points: newTask.points,
          category: newTask.category
        })
        .select();

      if (error) {
        console.error('Error adding task:', error);
        toast.error("Failed to save task");
        return;
      }

      // Update the local state with the task returned from Supabase (including generated ID)
      if (data && data[0]) {
        const persistedTask: Task = {
          id: data[0].id,
          text: data[0].text,
          completed: data[0].completed || false,
          createdAt: new Date(data[0].created_at as string),
          points: data[0].points || 10,
          color: data[0].color as string | undefined,
          category: data[0].category as string | undefined
        };

        updateTasks([persistedTask, ...tasks]);
        toast.success("Task added successfully");
      }
    } catch (err) {
      console.error('Error in handleAddTask:', err);
      toast.error("Failed to save task");
    }
  }, [tasks, updateTasks, getTaskPoints]);

  return { handleAddTask };
};
