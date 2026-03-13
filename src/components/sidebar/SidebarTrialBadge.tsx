import React from "react";

interface SidebarTrialBadgeProps {
  daysRemaining: number;
}

export const SidebarTrialBadge: React.FC<SidebarTrialBadgeProps> = ({ daysRemaining }) => {
  const totalDays = 7;
  const displaySize = 112;
  // Render at 2x for crisp edges on high-DPI screens
  const scale = 2;
  const size = displaySize * scale;
  const strokeWidth = 12 * scale;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = daysRemaining / totalDays;
  const activeLength = circumference * progress;
  const inactiveLength = circumference - activeLength;

  return (
    <div className="flex justify-center" style={{ marginTop: "-50px" }}>
      <div className="relative" style={{ width: displaySize, height: displaySize }}>
        <svg
          width={displaySize}
          height={displaySize}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          {/* Grey background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
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
          <span className="text-xs font-semibold leading-tight text-foreground">Trial</span>
          <span className="text-base font-bold leading-tight text-foreground">{daysRemaining} days</span>
          <span className="text-[10px] font-medium leading-tight text-foreground">left</span>
        </div>
      </div>
    </div>
  );
};
