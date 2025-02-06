import React from "react";

interface StarburstAnimationProps {
  colors: string[];
}

export const StarburstAnimation: React.FC<StarburstAnimationProps> = ({ colors }) => {
  const stars = Array.from({ length: 14 }).map((_, index) => {
    const rotation = (index * (360/14)) + "deg";
    
    return (
      <div
        key={index}
        className="absolute w-4 h-4 rounded-sm"
        style={{
          top: "calc(50% - 20px)",
          left: "50%",
          transform: `translate(-50%, -50%)`,
          backgroundColor: colors[index],
          opacity: "0.95",
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          animation: "starburst 1.5s infinite",
          animationDelay: `${index * 0.2}s`,
          "--rotation": rotation,
        } as React.CSSProperties}
      />
    );
  });

  return <>{stars}</>;
};