import React from "react";

interface DustParticlesProps {
  colors: string[];
}

export const DustParticles: React.FC<DustParticlesProps> = ({ colors }) => {
  const particles = Array.from({ length: 20 }).map((_, index) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomOffsetX = Math.random() * 100 - 50; // Random value between -50 and 50
    const randomDelay = Math.random() * 2; // Random delay between 0 and 2 seconds
    const randomSize = Math.random() * 3 + 1; // Random size between 1 and 4 pixels

    return (
      <div
        key={index}
        className="absolute rounded-full animate-float"
        style={{
          backgroundColor: randomColor,
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          top: "50%",
          left: "50%",
          opacity: 0,
          transform: "translate(-50%, -50%)",
          animation: `float ${2 + Math.random()}s ease-in-out infinite`,
          animationDelay: `${randomDelay}s`,
          "--offset-x": `${randomOffsetX}px`,
        } as React.CSSProperties}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
};