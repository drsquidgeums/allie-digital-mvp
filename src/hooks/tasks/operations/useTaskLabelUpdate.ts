
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useTaskLabelUpdate = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const handleUpdateTaskLabels = useCallback(async (id: string, labels: string[]) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ labels })
        .eq('id', id);

      if (error) {
        console.error('Error updating task labels:', error);
        toast.error("Failed to update task labels");
        return;
      }

      // Update local state
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, labels };
        }
        return task;
      });
      
      updateTasks(updatedTasks);
      console.log('Task labels updated:', id, labels);
      
      toast("Task updated", {
        description: "Task labels have been updated"
      });
    } catch (err) {
      console.error('Error in handleUpdateTaskLabels:', err);
      toast.error("Failed to update task labels");
    }
  }, [tasks, updateTasks]);

  return { handleUpdateTaskLabels };
};
