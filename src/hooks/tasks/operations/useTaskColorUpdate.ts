
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";

export const useTaskColorUpdate = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const handleUpdateTaskColor = useCallback(async (id: string, color: string) => {
    try {
      // Update task color in Supabase
      const { error } = await extendedSupabase
        .from('tasks')
        .update({ color })
        .eq('id', id);

      if (error) {
        console.error('Error updating task color:', error);
        toast.error("Failed to update task color");
        return;
      }

      // Update local state
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, color };
        }
        return task;
      });
      
      updateTasks(updatedTasks);
      // Using the correct toast API format
      toast("Task updated", {
        description: "Task colour has been updated"
      });
    } catch (err) {
      console.error('Error in handleUpdateTaskColor:', err);
      toast.error("Failed to update task color");
    }
  }, [tasks, updateTasks]);

  return { handleUpdateTaskColor };
};
