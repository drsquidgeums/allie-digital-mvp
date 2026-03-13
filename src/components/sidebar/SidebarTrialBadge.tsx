import React from "react";

interface SidebarTrialBadgeProps {
  daysRemaining: number;
}

export const SidebarTrialBadge: React.FC<SidebarTrialBadgeProps> = ({ daysRemaining }) => {
  const totalDays = 7;
  const size = 112;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = daysRemaining / totalDays;
  const activeLength = circumference * progress;
  const inactiveLength = circumference - activeLength;

  return (
    <div className="flex justify-center -mt-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grey background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted-foreground/30"
          />
          {/* Active arc (remaining days) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={`${activeLength} ${inactiveLength}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-semibold leading-tight text-foreground">Trial</span>
          <span className="text-sm font-bold leading-tight text-foreground">{daysRemaining}d</span>
        </div>
      </div>
    </div>
  );
};
