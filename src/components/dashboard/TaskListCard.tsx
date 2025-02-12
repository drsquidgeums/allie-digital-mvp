
import { Card } from "@/components/ui/card";
import { TaskList } from "./TaskList";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{t('tasks.title')}</h2>
      <TaskList
        tasks={tasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
    </Card>
  );
};
