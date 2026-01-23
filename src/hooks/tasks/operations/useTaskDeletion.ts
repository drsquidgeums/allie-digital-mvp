
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useTaskDeletion = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      // Delete task from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        toast.error("Failed to delete task");
        return;
      }

      // Update local state
      const filteredTasks = tasks.filter(task => task.id !== id);
      updateTasks(filteredTasks);
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error('Error in handleDeleteTask:', err);
      toast.error("Failed to delete task");
    }
  }, [tasks, updateTasks]);

  return { handleDeleteTask };
};
