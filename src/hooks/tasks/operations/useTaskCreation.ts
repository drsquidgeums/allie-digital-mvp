
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";
import { supabase } from "@/integrations/supabase/client";
import { taskTextSchema, checkRateLimit } from "@/utils/inputValidation";

const categories = ["work", "personal", "study", "health"];

export const useTaskCreation = (tasks: Task[], updateTasks: (tasks: Task[]) => void, getTaskPoints: (task: Task) => number) => {
  const handleAddTask = useCallback(async (text: string, taskDate: Date) => {
    if (!text.trim()) return;
    
    // Validate input
    try {
      taskTextSchema.parse(text);
    } catch {
      toast.error("Task text is invalid or too long (max 500 characters)");
      return;
    }
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("You must be logged in to create tasks");
      return;
    }
    
    // Rate limiting check
    if (!checkRateLimit(`task_creation_${session.user.id}`, 10, 60000)) { // 10 tasks per minute
      toast.error("Too many tasks created. Please wait a moment.");
      return;
    }
    
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
      // Insert task into Supabase with authenticated user
      const { data, error } = await extendedSupabase
        .from('tasks')
        .insert({
          text: newTask.text,
          completed: newTask.completed,
          created_at: newTask.createdAt.toISOString(),
          points: newTask.points,
          category: newTask.category,
          user_id: session.user.id
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
