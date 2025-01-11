import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useMusicControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(!audioRef.current.paused);
      setVolume(audioRef.current.volume);
      setIsMuted(audioRef.current.muted);
      setIsLooping(audioRef.current.loop);
    }
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    const normalizedVolume = newVolume / 100;
    audioRef.current.volume = normalizedVolume;
    setVolume(normalizedVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !audioRef.current.loop;
    setIsLooping(!isLooping);
    toast({
      title: isLooping ? "Loop disabled" : "Loop enabled",
      description: isLooping ? "Music will stop after playing once" : "Music will play continuously",
    });
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
    volume,
    isMuted,
    isLooping,
    setIsPlaying,
    togglePlay,
    setVolume: handleVolumeChange,
    toggleMute,
    toggleLoop,
  };
};