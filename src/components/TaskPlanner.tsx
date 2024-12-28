import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TaskPlanner = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <form onSubmit={addTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" className="bg-workspace-dark text-white hover:bg-workspace-dark/90">
          Add
        </Button>
      </form>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200"
          >
            <Button
              size="sm"
              variant="ghost"
              className={`p-1 h-6 w-6 ${task.completed ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
              onClick={() => toggleTask(task.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <span className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.text}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-red-500 hover:text-red-600"
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