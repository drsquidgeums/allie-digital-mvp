import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfWeek, addDays } from 'date-fns';

const COLORS = ['#22c55e', '#94a3b8'];

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
  const getPieChartData = () => [
    { name: 'Completed', value: tasks.filter(task => task.completed).length },
    { name: 'Pending', value: tasks.filter(task => !task.completed).length }
  ];

  const getBarChartData = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'MMM dd');
      const dayName = format(date, 'EEE');
      
      return {
        name: `${dayName}\n${dateStr}`,
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
        <h3 className="text-lg font-semibold mb-2">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getBarChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="pending" fill="#94a3b8" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};