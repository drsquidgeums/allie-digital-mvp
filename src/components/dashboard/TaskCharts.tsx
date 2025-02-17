
import { Task } from '@/types/task';
import { WeeklyProgressChart } from './WeeklyProgressChart';

interface TaskChartsProps {
  tasks: Task[];
}

export const TaskCharts = ({ tasks }: TaskChartsProps) => {
  return (
    <div className="flex flex-col space-y-8 bg-accent/10 p-6 rounded-lg mb-8">
      <WeeklyProgressChart tasks={tasks} />
    </div>
  );
};
