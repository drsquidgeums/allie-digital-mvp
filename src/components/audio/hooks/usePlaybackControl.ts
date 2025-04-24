
import { useToast } from '@/hooks/use-toast';
import { MusicOption, MUSIC_OPTIONS } from '../MusicOptions';

export const usePlaybackControl = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  isFocusModeActive: boolean
) => {
  const { toast } = useToast();

  const togglePlay = async (currentMusic: MusicOption | undefined) => {
    // If no music is provided, try to get from localStorage
    if (!audioRef.current) return false;
    
    if (!currentMusic) {
      const savedMusicId = localStorage.getItem('selectedMusicId');
      if (savedMusicId) {
        currentMusic = MUSIC_OPTIONS.find(m => m.id === savedMusicId);
      }
      
      if (!currentMusic) {
        toast({
          title: "Please select a music option",
          description: "Choose from the available music options to play",
        });
        return false;
      }
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset the playback position
        toast({
          title: "Music stopped",
          description: "Background music has been stopped",
        });
      } else {
        // Only set new source if we're starting playback or if the source is empty
        if (!audioRef.current.src || audioRef.current.src !== currentMusic.url) {
          audioRef.current.src = currentMusic.url;
        }
        await audioRef.current.play();
        toast({
          title: "Music playing",
          description: `Now playing: ${currentMusic.name}`,
        });
      }
      setIsPlaying(!isPlaying);
      return !isPlaying;
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback failed",
        description: "Unable to play the selected music. Please try another option.",
        variant: "destructive",
      });
      setIsPlaying(false);
      return false;
    }
  };

  return {
    togglePlay
  };
};
