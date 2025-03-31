
import { useTaskStore } from "./tasks/useTaskStore";
import { useTaskOperations } from "./tasks/useTaskOperations";
import { useTaskPoints } from "./tasks/useTaskPoints";

export const useTasks = () => {
  const { tasks, updateTasks } = useTaskStore();
  const { calculateTotalPoints } = useTaskPoints(tasks);
  const {
    showAchievement,
    setShowAchievement,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  } = useTaskOperations(tasks, updateTasks);

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
