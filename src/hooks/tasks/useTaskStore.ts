
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { extendedSupabase } from "@/integrations/extendedSupabaseClient";
import { toast } from "sonner";

// Shared state for tasks
let sharedTasks: Task[] = [];
const listeners = new Set<(tasks: Task[]) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(sharedTasks));
};

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>(sharedTasks);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await extendedSupabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          toast.error("Failed to load tasks");
          return;
        }

        // Convert Supabase data to Task objects
        const loadedTasks: Task[] = data.map(task => ({
          id: task.id,
          text: task.text,
          completed: task.completed || false,
          createdAt: new Date(task.created_at as string),
          points: task.points || 10,
          color: task.color || undefined,
          category: task.category || undefined
        }));

        sharedTasks = loadedTasks;
        notifyListeners();
      } catch (err) {
        console.error('Error in fetchTasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Set up realtime subscription
    const channel = extendedSupabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks' 
        }, 
        () => {
          // Refetch tasks when changes occur
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      extendedSupabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const listener = (newTasks: Task[]) => {
      setTasks(newTasks);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateTasks = async (newTasks: Task[]) => {
    sharedTasks = newTasks;
    notifyListeners();
  };

  return {
    tasks,
    loading,
    updateTasks
  };
};
