
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

    // Ensure we have an audio element to control
    const player: HTMLAudioElement = (() => {
      if (audioRef.current) return audioRef.current;
      if (typeof window !== 'undefined' && window.globalAudioPlayer) return window.globalAudioPlayer;
      try {
        const a = new Audio();
        a.loop = true;
        a.volume = 0.2;
        a.preload = 'none';
        a.crossOrigin = 'anonymous';
        if (typeof window !== 'undefined') {
          window.globalAudioPlayer = a;
        }
        return a;
      } catch (e) {
        console.error('Failed to initialize audio element', e);
        toast({
          title: 'Audio unavailable',
          description: 'Could not initialize the audio player in this environment.',
          variant: 'destructive',
        });
        // Throw to be caught by outer try/catch and stop flow
        throw e;
      }
    })();
    
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
        player.pause();
        player.currentTime = 0;
        toast({
          title: "Music stopped",
          description: "Background music has been stopped",
        });
        setIsPlaying(false);
        return false;
      } else {
        console.log('Attempting to play:', currentMusic.name, currentMusic.url);
        
        // Set source and load
        player.src = currentMusic.url;
        player.load();
        
        // Try to play immediately; if it fails, wait briefly for readiness and retry once
        try {
          await player.play();
        } catch (initialError) {
          await new Promise<void>((resolve, reject) => {
            const cleanup = () => {
              player.removeEventListener('canplay', onReady);
              player.removeEventListener('loadeddata', onReady);
              player.removeEventListener('error', onError);
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

            player.addEventListener('canplay', onReady, { once: true });
            player.addEventListener('loadeddata', onReady, { once: true });
            player.addEventListener('error', onError, { once: true });
          });

          await player.play();
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
