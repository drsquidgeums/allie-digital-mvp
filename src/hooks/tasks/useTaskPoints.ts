
import { useCallback } from "react";
import { Task } from "@/types/task";
import { useIncentives } from "../useIncentives";

export const useTaskPoints = (tasks: Task[]) => {
  const { checkTimeBonus, checkMilestones } = useIncentives(tasks);

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

  return { calculateTotalPoints };
};
