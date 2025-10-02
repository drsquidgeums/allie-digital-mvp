
import { useToast } from '@/hooks/use-toast';
import { MusicOption, MUSIC_OPTIONS } from '../MusicOptions';
import { useAudioFallback } from './useAudioFallback';

export const usePlaybackControl = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  isFocusModeActive: boolean
) => {
  const { toast } = useToast();
  const { testStreamingCapability, handleStreamingFailure, audioMode } = useAudioFallback();

  const togglePlay = async (currentMusic: MusicOption | undefined) => {
    // If audio is disabled, show info message
    if (audioMode === 'disabled') {
      toast({
        title: "Audio disabled",
        description: "Background music is disabled in this environment. All other features work normally.",
        variant: "default",
      });
      return false;
    }

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
        audioRef.current.currentTime = 0;
        toast({
          title: "Music stopped",
          description: "Background music has been stopped",
        });
        setIsPlaying(false);
        return false;
      } else {
        console.log('Attempting to play:', currentMusic.name, currentMusic.url);
        
        // Set source and load
        audioRef.current.src = currentMusic.url;
        audioRef.current.load();
        
        // Wait for the audio to be ready to play
        await new Promise<void>((resolve, reject) => {
          if (!audioRef.current) {
            reject(new Error('Audio element not found'));
            return;
          }

          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = (e: Event) => {
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(new Error('Failed to load audio'));
          };

          audioRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true });
          audioRef.current.addEventListener('error', handleError, { once: true });
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
      
      // Handle streaming failure through fallback system
      handleStreamingFailure(currentMusic);
      setIsPlaying(false);
      return false;
    }
  };

  return {
    togglePlay
  };
};
