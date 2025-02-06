import React from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingProgressProps {
  isLoading: boolean;
  progress: number;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ isLoading, progress }) => {
  if (!isLoading) return null;

  return (
    <div className="w-[70%]">
      <Progress value={progress} className="h-2" />
    </div>
  );
};