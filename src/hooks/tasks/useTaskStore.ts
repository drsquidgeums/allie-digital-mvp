
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No authenticated user, skipping task fetch');
          setLoading(false);
          return;
        }

        console.log('Fetching tasks from Supabase for user:', user.id);
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          setLoading(false);
          return;
        }

        // Transform Supabase data to Task type
        const transformedTasks: Task[] = (data || []).map(task => ({
          id: task.id,
          text: task.text,
          completed: task.completed || false,
          createdAt: new Date(task.created_at || new Date()),
          points: task.points || 10,
          color: task.color || undefined,
          category: task.category || undefined,
          labels: task.labels || []
        }));

        console.log('Loaded tasks from Supabase:', transformedTasks.length);
        setTasks(transformedTasks);
      } catch (err) {
        console.error('Error in fetchTasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to auth state changes to refetch tasks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchTasks();
      } else if (event === 'SIGNED_OUT') {
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateTasks = async (newTasks: Task[]) => {
    console.log('updateTasks called with:', newTasks.length, 'tasks');
    setTasks(newTasks);
  };

  return {
    tasks,
    loading,
    updateTasks
  };
};
