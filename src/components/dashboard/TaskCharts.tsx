import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const COLORS = ['#1A1F2C', '#7E69AB'];

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
    <div className="flex flex-col space-y-12">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
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
        <div className="h-72 w-full">
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
              <Bar dataKey="completed" fill="#1A1F2C" name="Completed" />
              <Bar dataKey="pending" fill="#7E69AB" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full pb-8">
        <h3 className="text-lg font-semibold mb-6">Task Status</h3>
        <div className="h-72 w-full">
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
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {getPieChartData().map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};