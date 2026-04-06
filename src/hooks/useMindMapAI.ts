import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyAICreditsUsed } from '@/utils/aiCreditsEvent';
import { handleAIUsageLimitError } from '@/utils/aiUsageLimitHandler';
import { MindMapNode } from '@/components/mindmap/types';

interface MindMapStructure {
  central_topic: string;
  branches: {
    label: string;
    children: string[];
  }[];
}

interface NodeExpansion {
  suggestions: string[];
}

export const useMindMapAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const generateMindMap = async (topic: string): Promise<MindMapStructure | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('mindmap-ai', {
        body: { type: 'generate', topic }
      });

      if (error) {
        if (handleAIUsageLimitError(error)) return null;
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      notifyAICreditsUsed();
      toast.success('Mind map generated!');
      return data as MindMapStructure;
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast.error('Failed to generate mind map');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const expandNode = async (
    nodeLabel: string, 
    existingNodes?: string[]
  ): Promise<string[] | null> => {
    setIsExpanding(true);
    try {
      const { data, error } = await supabase.functions.invoke('mindmap-ai', {
        body: { 
          type: 'expand', 
          nodeLabel,
          existingNodes 
        }
      });

      if (error) {
        if (handleAIUsageLimitError(error)) return null;
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      const result = data as NodeExpansion;
      notifyAICreditsUsed();
      toast.success(`Generated ${result.suggestions.length} suggestions!`);
      return result.suggestions;
    } catch (error) {
      console.error('Error expanding node:', error);
      toast.error('Failed to expand node');
      return null;
    } finally {
      setIsExpanding(false);
    }
  };

  return {
    isGenerating,
    isExpanding,
    generateMindMap,
    expandNode,
  };
};
