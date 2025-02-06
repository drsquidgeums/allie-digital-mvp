export const generateStarburstStyles = (index: number, colors: string[]) => {
  const rotation = (index * (360/14)) + "deg";
  
  return {
    top: "calc(50% - 20px)",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    backgroundColor: colors[index],
    opacity: "0.95",
    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    animation: "starburst 1.5s infinite",
    animationDelay: `${index * 0.2}s`,
    "--rotation": rotation,
  } as React.CSSProperties;
};

export const generateParticleStyles = (
  color: string,
  offsetX: number,
  offsetY: number,
  delay: number,
  size: number,
  duration: number
) => {
  return {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    top: "50%",
    left: "50%",
    opacity: 0,
    transform: "translate(-50%, -50%)",
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    "--offset-x": `${offsetX}px`,
    "--offset-y": `${offsetY}px`,
  } as React.CSSProperties;
};