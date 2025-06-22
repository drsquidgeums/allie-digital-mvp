
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioEvents = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setVolume: (volume: number) => void,
  setIsMuted: (muted: boolean) => void,
  setIsLooping: (looping: boolean) => void
) => {
  const { toast } = useToast();

  // Update playing state when audio element loads
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onerror = (e) => {
        setIsPlaying(false);
        toast({
          title: "Playback error",
          description: "Unable to play the selected music. Please try another option.",
          variant: "destructive",
        });
      };

      setIsPlaying(!audioRef.current.paused);
      setVolume(audioRef.current.volume);
      setIsMuted(audioRef.current.muted);
      setIsLooping(audioRef.current.loop);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onerror = null;
      }
    };
  }, [audioRef, setIsPlaying, setVolume, setIsMuted, setIsLooping, toast]);

  // Update playing state when audio events occur
  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
    };
  }, [audioRef, setIsPlaying]);
};
