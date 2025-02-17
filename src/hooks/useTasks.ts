
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { useIncentives } from "./useIncentives";

// Create a shared state outside the hook
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
    // Subscribe to changes
    const listener = (newTasks: Task[]) => {
      setTasks(newTasks);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const calculateTotalPoints = () => {
    return tasks.reduce((total, task) => {
      if (task.completed) {
        const basePoints = task.points;
        const timeBonus = checkTimeBonus(task);
        const milestoneBonus = checkMilestones(total + basePoints);
        return total + basePoints + timeBonus + milestoneBonus;
      }
      return total;
    }, 0);
  };

  const handleAddTask = (text: string, taskDate: Date) => {
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
  };

  const handleToggleTask = (id: string) => {
    sharedTasks = sharedTasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          updateStreak();
          updateCombo();
          updateCategoryProgress(task.category || 'general');
          weeklyChallenge.checkProgress(sharedTasks);
          
          const newTotalPoints = calculateTotalPoints() + task.points;
          if (newTotalPoints >= 20 && newTotalPoints < 50 || 
              newTotalPoints >= 50 && newTotalPoints < 100 ||
              newTotalPoints >= 100) {
            setShowAchievement(true);
          }
        }
        return { ...task, completed: newStatus };
      }
      return task;
    });
    notifyListeners();
  };

  const handleDeleteTask = (id: string) => {
    sharedTasks = sharedTasks.filter(task => task.id !== id);
    notifyListeners();
  };

  const handleUpdateTaskColor = (id: string, color: string) => {
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
  };

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
