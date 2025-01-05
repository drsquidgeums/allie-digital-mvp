import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useMusicSelection = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean
) => {
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const { toast } = useToast();

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

  return {
    selectedMusic,
    handleMusicChange,
  };
};