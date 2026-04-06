
import React, { useState, useEffect, useCallback } from 'react';

interface ReadingProgressBarProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ containerRef }) => {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    if (scrollHeight <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  if (progress <= 0) return null;

  return (
    <div className="h-1 w-full bg-muted/30 sticky top-0 z-10" aria-hidden="true">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
