import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useMusicControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const togglePlay = async (currentMusic: MusicOption | undefined) => {
    if (!audioRef.current || !currentMusic) {
      toast({
        title: "Please select a music option",
        description: "Choose from the available music options to play",
      });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        toast({
          title: "Music paused",
          description: "Background music has been paused",
        });
      } else {
        await audioRef.current.play();
        toast({
          title: "Music playing",
          description: `Now playing: ${currentMusic.name}`,
        });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback failed",
        description: "Unable to play the selected music. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    setIsPlaying,
    togglePlay,
  };
};