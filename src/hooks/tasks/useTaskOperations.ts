
import { useCallback, useState } from "react";
import { Task } from "@/types/task";
import { useToast } from "../use-toast";
import { useIncentives } from "../useIncentives";
import { useTaskPoints } from "./useTaskPoints";

const categories = ["work", "personal", "study", "health"];

export const useTaskOperations = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const { toast } = useToast();
  
  const {
    updateStreak,
    updateCategoryProgress,
    checkTimeBonus,
    updateCombo,
    weeklyChallenge,
    getTaskPoints,
  } = useIncentives(tasks);

  const { calculateTotalPoints } = useTaskPoints(tasks);

  const handleAddTask = useCallback((text: string, taskDate: Date) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: taskDate,
      points: getTaskPoints({ 
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: taskDate,
        points: 10,
        category: randomCategory
      }),
      category: randomCategory
    };

    updateTasks([...tasks, newTask]);
  }, [tasks, updateTasks, getTaskPoints]);

  const handleToggleTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = !task.completed;
    if (newStatus) {
      updateStreak();
      updateCombo();
      updateCategoryProgress(task.category || 'general');
      weeklyChallenge.checkProgress(tasks);
    }

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
        }
        return updatedTask;
      }
      return t;
    });
    
    updateTasks(updatedTasks);
  }, [tasks, updateTasks, updateStreak, updateCombo, updateCategoryProgress, weeklyChallenge, calculateTotalPoints]);

  const handleDeleteTask = useCallback((id: string) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    updateTasks(filteredTasks);
  }, [tasks, updateTasks]);

  const handleUpdateTaskColor = useCallback((id: string, color: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, color };
      }
      return task;
    });
    
    updateTasks(updatedTasks);
    toast({
      title: "Task updated",
      description: "Task color has been updated",
    });
  }, [tasks, updateTasks, toast]);

  return {
    showAchievement,
    setShowAchievement,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  };
};
