import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Trophy } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

const COLORS = ['#22c55e', '#94a3b8'];

const emitTaskNotification = (title: string, message: string) => {
  const event = new CustomEvent('taskNotification', {
    detail: { 
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: new Date()
    }
  });
  window.dispatchEvent(event);
};

export const TaskPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [points, setPoints] = useState(0);
  const { toast } = useToast();

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        createdAt: new Date(),
        points: 10
      }]);
      setNewTask("");
      emitTaskNotification(
        "New Task Added",
        `Task "${newTask}" has been added to your list`
      );
      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          setPoints(prev => prev + task.points);
          toast({
            title: "Points earned!",
            description: `You earned ${task.points} points for completing this task!`,
          });
        } else {
          setPoints(prev => prev - task.points);
        }
        emitTaskNotification(
          newStatus ? "Task Completed" : "Task Reopened",
          `Task "${task.text}" has been ${newStatus ? 'completed' : 'reopened'}`
        );
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.completed) {
        setPoints(prev => prev - task.points);
      }
      emitTaskNotification(
        "Task Deleted",
        `Task "${task.text}" has been removed`
      );
    }
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPieChartData = () => [
    { name: 'Completed', value: tasks.filter(task => task.completed).length },
    { name: 'Pending', value: tasks.filter(task => !task.completed).length }
  ];

  const getBarChartData = () => {
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    }).reverse();

    return lastWeek.map(day => ({
      name: day,
      completed: tasks.filter(task => 
        task.completed && 
        task.createdAt.toLocaleDateString('en-GB', { weekday: 'short' }) === day
      ).length,
      pending: tasks.filter(task =>
        !task.completed &&
        task.createdAt.toLocaleDateString('en-GB', { weekday: 'short' }) === day
      ).length
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-accent/10 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-semibold">Total Points:</span>
        </div>
        <span className="text-xl font-bold">{points}</span>
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

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
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              <Bar dataKey="pending" fill="#94a3b8" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border"
          >
            <Button
              size="sm"
              variant="ghost"
              className={`p-1 h-6 w-6 ${task.completed ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
              onClick={() => toggleTask(task.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.text}
            </span>
            <span className="text-sm text-muted-foreground">{task.points} pts</span>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-destructive hover:text-destructive/90"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};