import React from "react";

interface SidebarTrialBadgeProps {
  daysRemaining: number;
}

export const SidebarTrialBadge: React.FC<SidebarTrialBadgeProps> = ({ daysRemaining }) => {
  return (
    <div className="flex justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex flex-col items-center justify-center text-amber-500">
        <span className="text-[9px] font-semibold leading-tight">7-DAY</span>
        <span className="text-[9px] font-semibold leading-tight">TRIAL</span>
        <span className="text-xs font-bold leading-tight">{daysRemaining}d left</span>
      </div>
    </div>
  );
};
