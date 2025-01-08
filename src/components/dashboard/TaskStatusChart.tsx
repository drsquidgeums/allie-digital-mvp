import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Task } from '@/types/task';

const COLORS = ['#1A1F2C', '#7E69AB'];

interface TaskStatusChartProps {
  tasks: Task[];
}

export const TaskStatusChart = ({ tasks }: TaskStatusChartProps) => {
  const getPieChartData = () => [
    { name: 'Completed', value: tasks.filter(task => task.completed).length },
    { name: 'Pending', value: tasks.filter(task => !task.completed).length }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Task Status</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={getPieChartData()}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
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
  );
};