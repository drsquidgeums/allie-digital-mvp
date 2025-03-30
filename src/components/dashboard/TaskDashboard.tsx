
import React, { useState } from 'react';
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { TaskPlanner } from "@/components/TaskPlanner";
import { useTasks } from "@/hooks/useTasks";

export const TaskDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { 
    tasks, 
    handleAddTask, 
    handleToggleTask, 
    handleDeleteTask,
    handleUpdateTaskColor
  } = useTasks();

  // Filter tasks for the selected date
  const filteredTasks = tasks.filter(task => {
    if (!selectedDate) return true;
    
    const taskDate = new Date(task.createdAt);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <WorkspaceLayout>
      <div className="p-6 h-full">
        <TaskPlanner
          selectedDate={selectedDate}
          tasks={filteredTasks}
          onAddTask={(text) => handleAddTask(text, selectedDate)}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </WorkspaceLayout>
  );
};
