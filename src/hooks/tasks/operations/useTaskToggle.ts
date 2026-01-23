
import { useCallback, useState } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useTaskToggle = (
  tasks: Task[], 
  updateTasks: (tasks: Task[]) => void,
  updateStreak: () => void,
  updateCombo: () => void,
  updateCategoryProgress: (category: string) => void,
  weeklyChallenge: { checkProgress: (tasks: Task[]) => number },
  calculateTotalPoints: () => number
) => {
  const [showAchievement, setShowAchievement] = useState(false);

  const handleToggleTask = useCallback(async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newStatus = !task.completed;
      
      // Update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        toast.error("Failed to update task");
        return;
      }

      // Update local state
      const updatedTasks = tasks.map(t => {
        if (t.id === id) {
          const updatedTask = { ...t, completed: newStatus };
          if (newStatus) {
            const currentPoints = calculateTotalPoints();
            const newPoints = currentPoints + updatedTask.points;
            if (newPoints >= 20 && newPoints < 50 || 
                newPoints >= 50 && newPoints < 100 ||
                newPoints >= 100) {
              setTimeout(() => setShowAchievement(true), 0);
            }
            
            updateStreak();
            updateCombo();
            updateCategoryProgress(task.category || 'general');
            weeklyChallenge.checkProgress(tasks);
          }
          return updatedTask;
        }
        return t;
      });
      
      updateTasks(updatedTasks);
    } catch (err) {
      console.error('Error in handleToggleTask:', err);
      toast.error("Failed to update task");
    }
  }, [tasks, updateTasks, updateStreak, updateCombo, updateCategoryProgress, weeklyChallenge, calculateTotalPoints]);

  return { handleToggleTask, showAchievement, setShowAchievement };
};
