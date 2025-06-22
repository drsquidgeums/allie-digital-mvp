
import { useState, useCallback } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface LoadingStates {
  [key: string]: LoadingState;
}

export const useLoadingStates = () => {
  const [states, setStates] = useState<LoadingStates>({});

  const setLoadingState = useCallback((key: string, state: LoadingState) => {
    setStates(prev => ({
      ...prev,
      [key]: state
    }));
  }, []);

  const getLoadingState = useCallback((key: string): LoadingState => {
    return states[key] || 'idle';
  }, [states]);

  const isLoading = useCallback((key: string): boolean => {
    return states[key] === 'loading';
  }, [states]);

  const isSuccess = useCallback((key: string): boolean => {
    return states[key] === 'success';
  }, [states]);

  const isError = useCallback((key: string): boolean => {
    return states[key] === 'error';
  }, [states]);

  const resetState = useCallback((key: string) => {
    setStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const resetAllStates = useCallback(() => {
    setStates({});
  }, []);

  return {
    setLoadingState,
    getLoadingState,
    isLoading,
    isSuccess,
    isError,
    resetState,
    resetAllStates
  };
};
