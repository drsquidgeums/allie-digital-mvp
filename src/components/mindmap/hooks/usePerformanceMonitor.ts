
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    renderCount.current += 1;

    console.log(`[${componentName}] Render #${renderCount.current}, Time since last render: ${timeSinceLastRender.toFixed(2)}ms`);
    lastRenderTime.current = currentTime;
  });

  return renderCount.current;
};
