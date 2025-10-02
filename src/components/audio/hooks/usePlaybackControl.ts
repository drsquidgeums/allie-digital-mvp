
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
        
        // Try to play immediately; if it fails, wait briefly for readiness and retry once
        try {
          await audioRef.current.play();
        } catch (initialError) {
          await new Promise<void>((resolve, reject) => {
            if (!audioRef.current) {
              reject(new Error('Audio element not found'));
              return;
            }

            const cleanup = () => {
              audioRef.current?.removeEventListener('canplay', onReady);
              audioRef.current?.removeEventListener('loadeddata', onReady);
              audioRef.current?.removeEventListener('error', onError);
              clearTimeout(timeoutId);
            };

            const onReady = () => {
              cleanup();
              resolve();
            };

            const onError = () => {
              cleanup();
              reject(new Error('Failed to load audio'));
            };

            const timeoutId = window.setTimeout(() => {
              // Fallback: proceed even if readiness events don't fire
              cleanup();
              resolve();
            }, 1500);

            audioRef.current.addEventListener('canplay', onReady, { once: true });
            audioRef.current.addEventListener('loadeddata', onReady, { once: true });
            audioRef.current.addEventListener('error', onError, { once: true });
          });

          await audioRef.current.play();
        }

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
