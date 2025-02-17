
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";

interface Streak {
  count: number;
  lastCompleted: Date;
}

interface CategoryProgress {
  [key: string]: number;
}

interface TimeBonus {
  taskId: string;
  multiplier: number;
  expiresAt: Date;
}

export const useIncentives = (tasks: Task[]) => {
  const [streak, setStreak] = useState<Streak>({ count: 0, lastCompleted: new Date() });
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>({});
  const [activeTimeBonus, setActiveTimeBonus] = useState<TimeBonus[]>([]);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastTaskCompletionTime, setLastTaskCompletionTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Daily Streaks
  const updateStreak = useCallback(() => {
    const today = new Date();
    const lastDate = new Date(streak.lastCompleted);
    
    if (lastDate.toDateString() === today.toDateString()) return;
    
    if (lastDate.getTime() + 24 * 60 * 60 * 1000 >= today.getTime()) {
      setStreak(prev => ({
        count: prev.count + 1,
        lastCompleted: today
      }));
      
      if (streak.count + 1 >= 3) {
        toast({
          title: "Streak Bonus!",
          description: `${streak.count + 1} day streak! +${(streak.count + 1) * 5} bonus points!`,
        });
      }
    } else {
      setStreak({ count: 1, lastCompleted: today });
    }
  }, [streak.count, streak.lastCompleted, toast]);

  // Category Mastery
  const updateCategoryProgress = useCallback((category: string) => {
    setCategoryProgress(prev => {
      const newCount = (prev[category] || 0) + 1;
      if (newCount === 5) {
        toast({
          title: "Category Mastery!",
          description: `You've completed 5 ${category} tasks! +25 bonus points!`,
        });
      }
      return { ...prev, [category]: newCount };
    });
  }, [toast]);

  // Time-based Bonuses
  const checkTimeBonus = useCallback((task: Task) => {
    const now = new Date();
    const taskDate = new Date(task.createdAt);
    const hoursDiff = (now.getTime() - taskDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      toast({
        title: "Early Bird Bonus!",
        description: "Completed within 24 hours! +15 points!",
      });
      return 15;
    }
    return 0;
  }, [toast]);

  // Combo Rewards
  const updateCombo = useCallback(() => {
    const now = new Date();
    if (lastTaskCompletionTime && 
        now.getTime() - lastTaskCompletionTime.getTime() < 5 * 60 * 1000) {
      setComboMultiplier(prev => {
        const newMultiplier = Math.min(prev + 0.5, 3);
        if (newMultiplier > prev) {
          toast({
            title: "Combo Bonus!",
            description: `${newMultiplier}x points multiplier active!`,
          });
        }
        return newMultiplier;
      });
    } else {
      setComboMultiplier(1);
    }
    setLastTaskCompletionTime(now);
  }, [lastTaskCompletionTime, toast]);

  // Challenge System
  const weeklyChallenge = {
    target: 5,
    category: "health",
    reward: 50,
    checkProgress: useCallback((tasks: Task[]) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const healthTasks = tasks.filter(task => 
        task.completed && 
        task.category === "health" &&
        new Date(task.createdAt) >= weekStart
      );

      if (healthTasks.length >= 5) {
        toast({
          title: "Weekly Challenge Complete!",
          description: "Completed 5 health tasks this week! +50 bonus points!",
        });
        return 50;
      }
      return 0;
    }, [toast])
  };

  // Progress Milestones
  const checkMilestones = useCallback((points: number) => {
    const milestones = [200, 300, 500, 750, 1000];
    const achieved = milestones.find(m => points >= m && points - 10 < m);
    
    if (achieved) {
      toast({
        title: "Milestone Reached!",
        description: `Reached ${achieved} points! +${Math.floor(achieved * 0.1)} bonus points!`,
      });
      return Math.floor(achieved * 0.1);
    }
    return 0;
  }, [toast]);

  // Task Difficulty Levels
  const getTaskPoints = useCallback((task: Task) => {
    const basePoints = 10;
    const difficultyMultiplier = task.text.length > 50 ? 1.5 : 1;
    return Math.round(basePoints * difficultyMultiplier * comboMultiplier);
  }, [comboMultiplier]);

  return {
    streak,
    categoryProgress,
    comboMultiplier,
    updateStreak,
    updateCategoryProgress,
    checkTimeBonus,
    updateCombo,
    weeklyChallenge,
    checkMilestones,
    getTaskPoints,
  };
};
