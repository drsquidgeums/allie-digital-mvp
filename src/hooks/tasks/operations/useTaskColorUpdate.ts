
import { useCallback } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";

export const useTaskColorUpdate = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const handleUpdateTaskColor = useCallback(async (id: string, color: string) => {
    try {
      // Update local state only (since tasks are stored locally)
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, color };
        }
        return task;
      });
      
      updateTasks(updatedTasks);
      console.log('Task color updated:', id, color);
      
      toast("Task updated", {
        description: "Task color has been updated"
      });
    } catch (err) {
      console.error('Error in handleUpdateTaskColor:', err);
      toast.error("Failed to update task color");
    }
  }, [tasks, updateTasks]);

  return { handleUpdateTaskColor };
};
