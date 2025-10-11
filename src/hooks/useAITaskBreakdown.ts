import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Subtask {
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TaskBreakdown {
  subtasks: Subtask[];
  reasoning: string;
}

export const useAITaskBreakdown = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const breakdownTask = async (taskText: string, taskId?: string, category?: string): Promise<TaskBreakdown | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-task-breakdown', {
        body: { taskText, taskId, category }
      });

      if (error) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          toast({
            variant: 'destructive',
            title: 'Rate Limit Exceeded',
            description: 'Too many requests. Please try again in a moment.',
          });
        } else if (error.message?.includes('402') || error.message?.includes('credits')) {
          toast({
            variant: 'destructive',
            title: 'AI Credits Depleted',
            description: 'Please add credits to your workspace to continue using AI features.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Breakdown Failed',
            description: 'Unable to break down task. Please try again.',
          });
        }
        throw error;
      }

      toast({
        title: 'Task Breakdown Ready',
        description: `Generated ${data.breakdown.subtasks.length} subtasks`,
      });

      return data.breakdown;
    } catch (error) {
      console.error('Error breaking down task:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskBreakdowns = async (taskId: string) => {
    const { data, error } = await supabase
      .from('ai_task_breakdowns')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching breakdowns:', error);
      return [];
    }

    return data;
  };

  return {
    breakdownTask,
    getTaskBreakdowns,
    isLoading
  };
};
