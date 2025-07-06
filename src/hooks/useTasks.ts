
import { useTaskStore } from "./tasks/useTaskStore";
import { useTaskOperations } from "./tasks/useTaskOperations";
import { useTaskPoints } from "./tasks/useTaskPoints";

export const useTasks = () => {
  const { tasks, loading, updateTasks } = useTaskStore();
  const { calculateTotalPoints } = useTaskPoints(tasks);
  const {
    showAchievement,
    setShowAchievement,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor,
    handleUpdateTaskLabels
  } = useTaskOperations(tasks, updateTasks);

  return {
    tasks,
    loading,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor,
    handleUpdateTaskLabels
  };
};
