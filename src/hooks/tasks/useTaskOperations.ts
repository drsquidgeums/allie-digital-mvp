
import { useCallback, useState } from "react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { useIncentives } from "../useIncentives";
import { useTaskPoints } from "./useTaskPoints";
import { supabase } from "@/integrations/supabase/client";

const categories = ["work", "personal", "study", "health"];

export const useTaskOperations = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const [showAchievement, setShowAchievement] = useState(false);
  
  const {
    updateStreak,
    updateCategoryProgress,
    checkTimeBonus,
    updateCombo,
    weeklyChallenge,
    getTaskPoints,
  } = useIncentives(tasks);

  const { calculateTotalPoints } = useTaskPoints(tasks);

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
      const { data, error } = await supabase
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
          createdAt: new Date(data[0].created_at),
          points: data[0].points || 10,
          color: data[0].color,
          category: data[0].category
        };

        updateTasks([persistedTask, ...tasks]);
        toast.success("Task added successfully");
      }
    } catch (err) {
      console.error('Error in handleAddTask:', err);
      toast.error("Failed to save task");
    }
  }, [tasks, updateTasks, getTaskPoints]);

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

  const handleUpdateTaskColor = useCallback(async (id: string, color: string) => {
    try {
      // Update task color in Supabase
      const { error } = await supabase
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
      toast({
        title: "Task updated",
        description: "Task colour has been updated",
      });
    } catch (err) {
      console.error('Error in handleUpdateTaskColor:', err);
      toast.error("Failed to update task color");
    }
  }, [tasks, updateTasks]);

  return {
    showAchievement,
    setShowAchievement,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  };
};
