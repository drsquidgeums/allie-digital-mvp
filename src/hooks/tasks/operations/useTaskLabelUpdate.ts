
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";

export const useTaskLabelUpdate = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const handleUpdateTaskLabels = useCallback(async (id: string, labels: string[]) => {
    try {
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
