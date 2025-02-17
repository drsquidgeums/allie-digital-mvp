
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Task } from '@/types/task';

interface WeeklyProgressChartProps {
  tasks: Task[];
}

export const WeeklyProgressChart = ({ tasks }: WeeklyProgressChartProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
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
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={getBarChartData()} 
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              height={30}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend 
              formatter={(value) => {
                if (value === "Completed") {
                  return <span className="text-[#222222] dark:text-[#F1F1F1]">{value}</span>;
                }
                return <span className="text-[#7E69AB]">{value}</span>;
              }}
              iconType="square"
              wrapperStyle={{
                paddingTop: "10px"
              }}
            />
            <Bar 
              dataKey="completed" 
              fill="#222222" 
              name="Completed" 
              className="dark:fill-[#F1F1F1]" 
            />
            <Bar 
              dataKey="pending" 
              fill="#7E69AB" 
              name="Pending" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
