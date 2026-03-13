import React from "react";

interface SidebarTrialBadgeProps {
  daysRemaining: number;
}

export const SidebarTrialBadge: React.FC<SidebarTrialBadgeProps> = ({ daysRemaining }) => {
  const totalDays = 7;
  const elapsed = totalDays - daysRemaining;
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const segmentGap = 4; // gap in pixels between segments
  const gapAngle = (segmentGap / circumference) * 360;
  const segmentAngle = 360 / totalDays;
  const arcAngle = segmentAngle - gapAngle;
  const arcLength = (arcAngle / 360) * circumference;
  const gapLength = (gapAngle / 360) * circumference;

  const segments = Array.from({ length: totalDays }, (_, i) => {
    const isElapsed = i < elapsed;
    const rotation = -90 + i * segmentAngle;
    return (
      <circle
        key={i}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={isElapsed ? "stroke-muted-foreground/40" : "stroke-foreground"}
        strokeDasharray={`${arcLength} ${circumference - arcLength}`}
        strokeDashoffset={0}
        transform={`rotate(${rotation} ${center} ${center})`}
      />
    );
  });

  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-semibold leading-tight text-foreground">Trial</span>
          <span className="text-[10px] font-bold leading-tight text-foreground">{daysRemaining}d left</span>
        </div>
      </div>
    </div>
  );
};
