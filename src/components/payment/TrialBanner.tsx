import React from "react";
import { Clock } from "lucide-react";

interface TrialBannerProps {
  daysRemaining: number;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ daysRemaining }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-1.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <Clock className="h-4 w-4" />
      <span>
        Free trial: {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
      </span>
    </div>
  );
};
