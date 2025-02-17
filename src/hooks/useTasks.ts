import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { useIncentives } from "./useIncentives";

let sharedTasks: Task[] = [];
const listeners = new Set<(tasks: Task[]) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(sharedTasks));
};

const categories = ["work", "personal", "study", "health"];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(sharedTasks);
  const [showAchievement, setShowAchievement] = useState(false);
  const { toast } = useToast();
  
  const {
    updateStreak,
    updateCategoryProgress,
    checkTimeBonus,
    updateCombo,
    weeklyChallenge,
    checkMilestones,
    getTaskPoints,
  } = useIncentives(tasks);

  useEffect(() => {
    const listener = (newTasks: Task[]) => {
      setTasks(newTasks);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const calculateTotalPoints = useCallback(() => {
    return tasks.reduce((total, task) => {
      if (task.completed) {
        const basePoints = task.points;
        const timeBonus = checkTimeBonus(task);
        const milestoneBonus = checkMilestones(total + basePoints);
        return total + basePoints + timeBonus + milestoneBonus;
      }
      return total;
    }, 0);
  }, [tasks, checkTimeBonus, checkMilestones]);

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

    sharedTasks = [...sharedTasks, newTask];
    notifyListeners();
  }, [getTaskPoints]);

  const handleToggleTask = useCallback((id: string) => {
    const task = sharedTasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = !task.completed;
    if (newStatus) {
      updateStreak();
      updateCombo();
      updateCategoryProgress(task.category || 'general');
      weeklyChallenge.checkProgress(sharedTasks);
    }

    sharedTasks = sharedTasks.map(t => {
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
    
    notifyListeners();
  }, [updateStreak, updateCombo, updateCategoryProgress, weeklyChallenge, calculateTotalPoints]);

  const handleDeleteTask = useCallback((id: string) => {
    sharedTasks = sharedTasks.filter(task => task.id !== id);
    notifyListeners();
  }, []);

  const handleUpdateTaskColor = useCallback((id: string, color: string) => {
    sharedTasks = sharedTasks.map(task => {
      if (task.id === id) {
        return { ...task, color };
      }
      return task;
    });
    notifyListeners();
    toast({
      title: "Task updated",
      description: "Task color has been updated",
    });
  }, [toast]);

  return {
    tasks,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  };
};
