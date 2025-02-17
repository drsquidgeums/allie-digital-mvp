
import { Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog-root";
import { useToast } from "@/hooks/use-toast";

interface TaskAchievementsProps {
  points: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskAchievements = ({ points, isOpen, onClose }: TaskAchievementsProps) => {
  const { toast } = useToast();
  
  const getAchievementMessage = (points: number) => {
    if (points >= 100) return "Master Achiever";
    if (points >= 50) return "Task Champion";
    if (points >= 20) return "Rising Star";
    return "";
  };

  const message = getAchievementMessage(points);
  
  if (!message) return null;

  const handleAchievementDisplay = () => {
    toast({
      title: "Achievement Unlocked!",
      description: `You've earned the "${message}" badge!`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-popover dark:bg-[#333333] dark:text-[#FAFAFA] dark:border dark:border-white/20 animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 dark:text-[#FAFAFA]">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievement Unlocked!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold mb-2 dark:text-[#FAFAFA]">{message}</h3>
          <p className="text-muted-foreground dark:text-gray-300">
            Congratulations! You've earned {points} points!
          </p>
          <button
            onClick={handleAchievementDisplay}
            className="mt-4 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-md transition-colors dark:bg-[#444444] dark:hover:bg-[#555555] dark:text-[#FAFAFA]"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
