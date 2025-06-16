
import { useState, useCallback, useRef } from 'react';
import { MindMapNode } from '../types';
import { Edge } from '@xyflow/react';

interface HistoryState {
  nodes: MindMapNode[];
  edges: Edge[];
}

export const useMindMapHistory = (initialNodes: MindMapNode[], initialEdges: Edge[]) => {
  const [history, setHistory] = useState<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUpdatingFromHistory = useRef(false);

  const saveState = useCallback((nodes: MindMapNode[], edges: Edge[]) => {
    if (isUpdatingFromHistory.current) return;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      // Limit history to 50 steps
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      isUpdatingFromHistory.current = true;
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      isUpdatingFromHistory.current = true;
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const clearHistoryFlag = useCallback(() => {
    isUpdatingFromHistory.current = false;
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistoryFlag
  };
};
