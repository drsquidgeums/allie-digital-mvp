
import { Card } from "@/components/ui/card";
import { TaskList } from "./TaskList";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
  color?: string;
}

interface TaskListCardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskColor: (id: string, color: string) => void;
}

export const TaskListCard = ({ tasks, onToggleTask, onDeleteTask, onUpdateTaskColor }: TaskListCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{t('tasks.title')}</h2>
      <TaskList
        tasks={tasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onUpdateTaskColor={onUpdateTaskColor}
      />
    </Card>
  );
};
