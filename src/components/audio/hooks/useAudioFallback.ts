
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useAudioFallback = () => {
  const [isStreamingBlocked, setIsStreamingBlocked] = useState(false);
  const [audioMode, setAudioMode] = useState<'streaming' | 'disabled' | 'local'>('streaming');
  const { toast } = useToast();

  const testStreamingCapability = useCallback(async (url: string): Promise<boolean> => {
    try {
      // Test if we can create and load audio
      const testAudio = new Audio();
      
      return new Promise((resolve) => {
        let timeoutId: NodeJS.Timeout;
        
        const cleanup = () => {
          testAudio.removeEventListener('canplay', onCanPlay);
          testAudio.removeEventListener('error', onError);
          testAudio.removeEventListener('loadstart', onLoadStart);
          clearTimeout(timeoutId);
          testAudio.src = '';
        };

        const onCanPlay = () => {
          cleanup();
          resolve(true);
        };

        const onError = () => {
          cleanup();
          resolve(false);
        };

        const onLoadStart = () => {
          // If loadstart fires, it means we can at least attempt to load
          cleanup();
          resolve(true);
        };

        testAudio.addEventListener('canplay', onCanPlay);
        testAudio.addEventListener('error', onError);
        testAudio.addEventListener('loadstart', onLoadStart);
        
        // Very short timeout for testing
        timeoutId = setTimeout(() => {
          cleanup();
          resolve(false);
        }, 1000);

        testAudio.preload = 'none';
        testAudio.volume = 0;
        testAudio.src = url;
        testAudio.load();
      });
    } catch (error) {
      return false;
    }
  }, []);

  const handleStreamingFailure = useCallback((music: MusicOption) => {
    if (!isStreamingBlocked) {
      setIsStreamingBlocked(true);
      setAudioMode('disabled');
      
      toast({
        title: "Audio streaming unavailable",
        description: "Background music has been disabled due to network restrictions. The app will continue to work normally without audio.",
        variant: "default",
      });
    }
  }, [isStreamingBlocked, toast]);

  const enableAudioDisabledMode = useCallback(() => {
    setAudioMode('disabled');
    setIsStreamingBlocked(true);
    
    toast({
      title: "Audio disabled",
      description: "Background music is disabled in this environment. All other features remain fully functional.",
      variant: "default",
    });
  }, [toast]);

  const retryStreaming = useCallback(() => {
    setIsStreamingBlocked(false);
    setAudioMode('streaming');
    
    toast({
      title: "Retrying audio",
      description: "Attempting to enable background music again.",
    });
  }, [toast]);

  return {
    isStreamingBlocked,
    audioMode,
    testStreamingCapability,
    handleStreamingFailure,
    enableAudioDisabledMode,
    retryStreaming
  };
};
