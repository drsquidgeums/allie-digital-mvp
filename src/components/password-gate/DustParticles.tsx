import React from "react";
import { generateParticleStyles } from "@/utils/animations";

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
        style={generateParticleStyles(
          randomColor,
          randomOffsetX,
          randomOffsetY,
          randomDelay,
          randomSize,
          randomDuration
        )}
      />
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-75">
      {particles}
    </div>
  );
};