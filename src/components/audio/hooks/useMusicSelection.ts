
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption, MUSIC_OPTIONS } from '../MusicOptions';

export const useMusicSelection = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean
) => {
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const { toast } = useToast();

  // Load initial state from localStorage and listen for state changes from other components
  useEffect(() => {
    // Restore state from localStorage
    const savedMusicId = localStorage.getItem('selectedMusicId');
    if (savedMusicId) {
      setSelectedMusic(savedMusicId);
      
      // Restore the audio source if we have a reference
      if (audioRef.current && savedMusicId) {
        const savedMusic = MUSIC_OPTIONS.find(opt => opt.id === savedMusicId);
        if (savedMusic) {
          const isAlreadyPlaying = !audioRef.current.paused;
          const isSameSrc = audioRef.current.src?.includes(savedMusic.url);
          // Avoid resetting the stream if it's already playing the same source
          if (!isAlreadyPlaying || !isSameSrc) {
            audioRef.current.src = savedMusic.url;
          }
        }
      }
    }
    
    // Listen for audio state changes from other components
    const handleAudioStateChange = (event: CustomEvent) => {
      const { selectedMusic: newSelectedMusic } = event.detail;
      if (newSelectedMusic && newSelectedMusic !== selectedMusic) {
        setSelectedMusic(newSelectedMusic);
      }
    };
    
    window.addEventListener('audioPlayerStateChanged', handleAudioStateChange as EventListener);
    
    return () => {
      window.removeEventListener('audioPlayerStateChanged', handleAudioStateChange as EventListener);
    };
  }, [audioRef]);

  const handleMusicChange = async (music: MusicOption) => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.src) {
        audioRef.current.pause();
      }

      audioRef.current.src = music.url;
      setSelectedMusic(music.id);
      
      // Persist to localStorage
      localStorage.setItem('selectedMusicId', music.id);
      
      if (isPlaying) {
        await audioRef.current.play();
        toast({
          title: "Music changed",
          description: `Now playing: ${music.name}`,
        });
      }
      
      // Dispatch event to notify other components about the change
      window.dispatchEvent(new CustomEvent('musicSelectionChanged', { 
        detail: { 
          musicId: music.id,
          musicName: music.name,
          musicUrl: music.url
        } 
      }));
    } catch (error) {
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
