
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface WeeklyProgressChartProps {
  completedTasks: number[];
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ completedTasks }) => {
  const today = new Date();
  // Get start of current week (Sunday)
  const startDate = startOfWeek(today);
  // Get each day of the week
  const days = eachDayOfInterval({
    start: startDate,
    end: endOfWeek(today)
  });

  // Create data for chart
  const data = days.map((day, index) => ({
    name: format(day, 'EEE'),
    tasks: completedTasks[index] || 0,
    fullDate: format(day, 'MMM d')
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-md">
          <p className="font-medium">{`${payload[0].payload.fullDate}`}</p>
          <p className="text-primary">{`Tasks: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false}
          stroke="var(--muted-foreground)"
        />
        <YAxis 
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          stroke="var(--muted-foreground)"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="tasks" 
          fill="var(--primary)" 
          radius={[4, 4, 0, 0]}
          barSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
