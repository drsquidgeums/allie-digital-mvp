
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyProgressChart } from './WeeklyProgressChart';
import { Task } from '@/types/task';

interface TaskChartsProps {
  tasks: Task[];
}

export const TaskCharts: React.FC<TaskChartsProps> = ({ tasks }) => {
  // Process tasks data for the chart
  const completedTasksByDay = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
  
  tasks.forEach(task => {
    if (task.completed) {
      const completedDate = new Date(task.completedAt || Date.now());
      const dayOfWeek = completedDate.getDay(); // 0 = Sunday, 6 = Saturday
      completedTasksByDay[dayOfWeek]++;
    }
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <WeeklyProgressChart completedTasks={completedTasksByDay} />
      </CardContent>
    </Card>
  );
};
