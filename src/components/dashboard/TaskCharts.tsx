import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const COLORS = ['#7E69AB', '#D6BCFA']; // Dark and light purple

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskChartsProps {
  tasks: Task[];
}

export const TaskCharts = ({ tasks }: TaskChartsProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const getPieChartData = () => [
    { name: 'Completed', value: tasks.filter(task => task.completed).length },
    { name: 'Pending', value: tasks.filter(task => !task.completed).length }
  ];

  const getBarChartData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(currentWeekStart, i);
      const dayName = format(date, 'EEE');
      
      return {
        name: dayName,
        completed: tasks.filter(task => 
          task.completed && 
          format(task.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length,
        pending: tasks.filter(task =>
          !task.completed &&
          format(task.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length
      };
    });
  };

  const navigateWeek = (direction: 'forward' | 'backward') => {
    setCurrentWeekStart(current => 
      direction === 'forward' ? addWeeks(current, 1) : subWeeks(current, 1)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-64">
        <h3 className="text-lg font-semibold mb-2">Task Status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={getPieChartData()}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {getPieChartData().map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Weekly Progress</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('backward')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center">
              {format(currentWeekStart, 'MMM dd')} - {format(addDays(currentWeekStart, 6), 'MMM dd, yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('forward')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getBarChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              height={30}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#7E69AB" name="Completed" />
            <Bar dataKey="pending" fill="#D6BCFA" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};