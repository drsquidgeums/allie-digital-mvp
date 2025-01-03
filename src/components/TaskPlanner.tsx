import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskCharts } from "./dashboard/TaskCharts";
import { TaskList } from "./dashboard/TaskList";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskPlannerProps {
  selectedDate?: Date;
}

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

export const TaskPlanner = ({ selectedDate }: TaskPlannerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [points, setPoints] = useState(0);
  const { toast } = useToast();

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const taskDate = selectedDate || new Date();
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        createdAt: taskDate,
        points: 10
      }]);
      setNewTask("");
      emitTaskNotification(
        "New Task Added",
        `Task "${newTask}" has been added to your list for ${taskDate.toLocaleDateString()}`
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
          placeholder={`Add a new task${selectedDate ? ` for ${selectedDate.toLocaleDateString()}` : ''}...`}
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      <TaskCharts tasks={tasks} />
      <TaskList 
        tasks={tasks} 
        onToggleTask={toggleTask} 
        onDeleteTask={deleteTask}
      />
    </div>
  );
};