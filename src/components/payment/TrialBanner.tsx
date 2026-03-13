import React from "react";
import { Clock } from "lucide-react";

interface TrialBannerProps {
  daysRemaining: number;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ daysRemaining }) => {
  return (
    <div className="w-full bg-amber-500 text-white text-center py-1.5 px-4 text-sm font-medium flex items-center justify-center gap-2 shrink-0">
      <Clock className="h-4 w-4" />
      <span>
        Free trial: {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
      </span>
    </div>
  );
};
