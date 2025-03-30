
import React, { useState } from 'react';
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { TaskPlanner } from "@/components/TaskPlanner";
import { useTasks } from "@/hooks/useTasks";
import { TaskListCard } from "@/components/dashboard/TaskListCard";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskPlanner
              selectedDate={selectedDate}
              tasks={filteredTasks}
              onAddTask={(text) => handleAddTask(text, selectedDate)}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          <div className="space-y-6">
            <Card className="p-4 border-none shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-none"
              />
            </Card>
            <TaskListCard
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskColor={handleUpdateTaskColor}
            />
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
