import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioInstance = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      toast({
        title: "Playback error",
        description: "There was an error loading the audio file. Please try another option.",
        variant: "destructive",
      });
    };

    audioRef.current.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
  }, [toast]);

  return audioRef;
};