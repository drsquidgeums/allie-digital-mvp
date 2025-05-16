
import { useState, useEffect } from "react";

export const useWordCount = (text: string, maxWords: number = 500) => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [isOverLimit, setIsOverLimit] = useState<boolean>(false);

  // Update word count when text changes
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setIsOverLimit(words > maxWords);
  }, [text, maxWords]);

  return { wordCount, isOverLimit };
};
