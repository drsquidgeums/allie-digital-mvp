
import { useState } from "react";
import { Task } from "@/types/task";
import { useIncentives } from "../useIncentives";
import { useTaskPoints } from "./useTaskPoints";
import { useTaskCreation } from "./operations/useTaskCreation";
import { useTaskToggle } from "./operations/useTaskToggle";
import { useTaskDeletion } from "./operations/useTaskDeletion";
import { useTaskColorUpdate } from "./operations/useTaskColorUpdate";

export const useTaskOperations = (tasks: Task[], updateTasks: (tasks: Task[]) => void) => {
  const {
    updateStreak,
    updateCategoryProgress,
    updateCombo,
    weeklyChallenge,
    getTaskPoints,
  } = useIncentives(tasks);

  const { calculateTotalPoints } = useTaskPoints(tasks);
  
  const { handleAddTask } = useTaskCreation(tasks, updateTasks, getTaskPoints);
  
  const { 
    handleToggleTask, 
    showAchievement, 
    setShowAchievement 
  } = useTaskToggle(
    tasks, 
    updateTasks, 
    updateStreak, 
    updateCombo, 
    updateCategoryProgress, 
    weeklyChallenge, 
    calculateTotalPoints
  );
  
  const { handleDeleteTask } = useTaskDeletion(tasks, updateTasks);
  
  const { handleUpdateTaskColor } = useTaskColorUpdate(tasks, updateTasks);

  return {
    showAchievement,
    setShowAchievement,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  };
};
