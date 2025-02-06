import React from "react";

interface DustParticlesProps {
  colors: string[];
}

export const DustParticles: React.FC<DustParticlesProps> = ({ colors }) => {
  const particles = Array.from({ length: 40 }).map((_, index) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomOffsetX = Math.random() * 300 - 150;
    const randomOffsetY = Math.random() * 200 - 100;
    const randomDelay = Math.random() * 3;
    const randomSize = Math.random() * 5 + 2;
    const randomDuration = 2 + Math.random() * 3;

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
          animation: `float ${randomDuration}s ease-in-out infinite`,
          animationDelay: `${randomDelay}s`,
          "--offset-x": `${randomOffsetX}px`,
          "--offset-y": `${randomOffsetY}px`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-75">
      {particles}
    </div>
  );
};