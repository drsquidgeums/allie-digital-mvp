
import { Task } from "@/types/task";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";
import { toast } from "sonner";
import { taskTextSchema, checkRateLimit } from "@/utils/inputValidation";

export const useTaskCreation = (
  tasks: Task[], 
  updateTasks: (tasks: Task[]) => void,
  getTaskPoints: (text: string) => number
) => {
  const handleAddTask = async (text: string, color?: string, category?: string) => {
    // Rate limiting check
    const rateLimitKey = `task_creation_${Date.now()}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) { // 10 tasks per minute
      toast.error("Too many tasks created. Please slow down.");
      return;
    }

    // Validate task text
    try {
      taskTextSchema.parse(text);
    } catch (error: any) {
      toast.error(error.errors[0]?.message || "Invalid task text");
      return;
    }

    const sanitizedText = text.trim();
    if (!sanitizedText) {
      toast.error("Task text cannot be empty");
      return;
    }

    const points = getTaskPoints(sanitizedText);
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: sanitizedText,
      completed: false,
      createdAt: new Date(),
      points,
      color,
      category
    };

    try {
      // Add to Supabase
      const { error } = await extendedSupabase
        .from('tasks')
        .insert([{
          id: newTask.id,
          user_id: 'anonymous', // Will be updated when auth is implemented
          text: sanitizedText,
          completed: false,
          points,
          color,
          category,
          created_at: newTask.createdAt.toISOString()
        }]);

      if (error) {
        console.error('Error adding task to Supabase:', error);
        toast.error("Failed to save task");
        return;
      }

      // Update local state
      const updatedTasks = [newTask, ...tasks];
      updateTasks(updatedTasks);
      
      toast.success(`Task added! +${points} points`);
    } catch (error) {
      console.error('Error in handleAddTask:', error);
      toast.error("Failed to add task");
    }
  };

  return { handleAddTask };
};
