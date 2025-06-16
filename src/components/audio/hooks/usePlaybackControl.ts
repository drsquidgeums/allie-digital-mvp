
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
        setIsPlaying(false);
        return false;
      } else {
        // Always set the source and load before playing
        audioRef.current.src = currentMusic.url;
        audioRef.current.load(); // Explicitly load the new source
        
        // Wait for the audio to be ready
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            resolve(void 0);
          };
          
          const handleError = (e: Event) => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(e);
          };
          
          audioRef.current?.addEventListener('canplay', handleCanPlay);
          audioRef.current?.addEventListener('error', handleError);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(new Error('Audio loading timeout'));
          }, 5000);
        });
        
        await audioRef.current.play();
        toast({
          title: "Music playing",
          description: `Now playing: ${currentMusic.name}`,
        });
        setIsPlaying(true);
        return true;
      }
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
