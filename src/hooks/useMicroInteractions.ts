
import { useState, useCallback } from 'react';

export type InteractionState = 'idle' | 'processing' | 'success' | 'error';

export interface MicroInteractionConfig {
  duration?: number;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useMicroInteractions = () => {
  const [state, setState] = useState<InteractionState>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerInteraction = useCallback(async (
    actionFn: () => Promise<void> | void,
    config: MicroInteractionConfig = {}
  ) => {
    const { duration = 300, onComplete, onError } = config;
    
    try {
      setState('processing');
      setIsAnimating(true);
      
      await actionFn();
      
      setState('success');
      
      // Brief success state before returning to idle
      setTimeout(() => {
        setState('idle');
        setIsAnimating(false);
        onComplete?.();
      }, duration);
      
    } catch (error) {
      setState('error');
      onError?.(error as Error);
      
      // Brief error state before returning to idle
      setTimeout(() => {
        setState('idle');
        setIsAnimating(false);
      }, duration);
    }
  }, []);

  const getStateClasses = useCallback(() => {
    switch (state) {
      case 'processing':
        return 'action-processing';
      case 'success':
        return 'action-success';
      case 'error':
        return 'upload-error';
      default:
        return '';
    }
  }, [state]);

  return {
    state,
    isAnimating,
    triggerInteraction,
    getStateClasses
  };
};
