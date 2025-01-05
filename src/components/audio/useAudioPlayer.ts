import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from './MusicOptions';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      toast({
        title: "Playback error",
        description: "There was an error loading the audio file. Please try another option.",
        variant: "destructive",
      });
      setIsPlaying(false);
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

  const handleMusicChange = async (music: MusicOption) => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.src) {
        audioRef.current.pause();
      }

      audioRef.current.src = music.url;
      setSelectedMusic(music.id);
      
      if (isPlaying) {
        await audioRef.current.play();
        toast({
          title: "Music changed",
          description: `Now playing: ${music.name}`,
        });
      }
    } catch (error) {
      console.error('Error changing music:', error);
      toast({
        title: "Error changing music",
        description: "Unable to load the selected music",
        variant: "destructive",
      });
    }
  };

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
    selectedMusic,
    handleMusicChange,
    togglePlay
  };
};