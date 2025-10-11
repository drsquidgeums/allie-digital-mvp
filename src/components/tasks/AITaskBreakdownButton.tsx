import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useAITaskBreakdown } from '@/hooks/useAITaskBreakdown';

interface AITaskBreakdownButtonProps {
  taskText: string;
  taskId?: string;
  category?: string;
  onBreakdownComplete?: (breakdown: any) => void;
}

export const AITaskBreakdownButton: React.FC<AITaskBreakdownButtonProps> = ({
  taskText,
  taskId,
  category,
  onBreakdownComplete
}) => {
  const { breakdownTask, isLoading } = useAITaskBreakdown();

  const handleBreakdown = async () => {
    const breakdown = await breakdownTask(taskText, taskId, category);
    if (breakdown && onBreakdownComplete) {
      onBreakdownComplete(breakdown);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBreakdown}
      disabled={isLoading}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isLoading ? 'Breaking down...' : 'AI Breakdown'}
    </Button>
  );
};
