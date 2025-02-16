
import { Trophy } from "lucide-react";

interface TaskPointsProps {
  points: number;
}

export const TaskPoints = ({ points }: TaskPointsProps) => {
  return (
    <div className="flex items-center justify-between bg-accent/10 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <span className="font-semibold">Total Points:</span>
      </div>
      <span className="text-xl font-bold">{points}</span>
    </div>
  );
};
