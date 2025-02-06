import React from "react";
import { generateStarburstStyles } from "@/utils/animations";

interface StarburstAnimationProps {
  colors: string[];
}

export const StarburstAnimation: React.FC<StarburstAnimationProps> = ({ colors }) => {
  const stars = Array.from({ length: 14 }).map((_, index) => (
    <div
      key={index}
      className="absolute w-4 h-4 rounded-sm"
      style={generateStarburstStyles(index, colors)}
    />
  ));

  return <>{stars}</>;
};