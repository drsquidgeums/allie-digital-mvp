import { Card } from "@/components/ui/card";
import { TaskList } from "./TaskList";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskListCardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskListCard = ({ tasks, onToggleTask, onDeleteTask }: TaskListCardProps) => {
  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <TaskList
        tasks={tasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
    </Card>
  );
};