import { Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog-root";

interface TaskAchievementsProps {
  points: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskAchievements = ({ points, isOpen, onClose }: TaskAchievementsProps) => {
  const getAchievementMessage = (points: number) => {
    if (points >= 100) return "Master Achiever";
    if (points >= 50) return "Task Champion";
    if (points >= 20) return "Rising Star";
    return "";
  };

  const message = getAchievementMessage(points);
  
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievement Unlocked!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">{message}</h3>
          <p className="text-muted-foreground">
            Congratulations! You've earned {points} points!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};