
import { Task } from '@/types/task';
import { WeeklyProgressChart } from './WeeklyProgressChart';

interface TaskChartsProps {
  tasks: Task[];
}

export const TaskCharts = ({ tasks }: TaskChartsProps) => {
  return (
    <div className="h-full flex flex-col bg-accent/10 p-6 rounded-lg">
      <WeeklyProgressChart tasks={tasks} />
    </div>
  );
};
