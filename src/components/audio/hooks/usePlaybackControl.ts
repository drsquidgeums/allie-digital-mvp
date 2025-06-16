
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
        
        // Test streaming capability first
        const canStream = await testStreamingCapability(currentMusic.url);
        if (!canStream) {
          handleStreamingFailure(currentMusic);
          return false;
        }

        // Set source and load
        audioRef.current.src = currentMusic.url;
        audioRef.current.load();
        
        // Wait for audio to be ready with better error handling
        await new Promise((resolve, reject) => {
          let timeoutId: NodeJS.Timeout;
          
          const handleCanPlay = () => {
            clearTimeout(timeoutId);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
            resolve(void 0);
          };
          
          const handleCanPlayThrough = () => {
            clearTimeout(timeoutId);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
            resolve(void 0);
          };
          
          const handleError = (e: Event) => {
            clearTimeout(timeoutId);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
            reject(e);
          };
          
          audioRef.current?.addEventListener('canplay', handleCanPlay);
          audioRef.current?.addEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current?.addEventListener('error', handleError);
          
          // Reduced timeout to 2 seconds for faster feedback
          timeoutId = setTimeout(() => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
            reject(new Error('Audio loading timeout'));
          }, 2000);
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
