
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
        
        // Add a simple timeout for audio loading
        const playPromise = new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Audio loading timeout'));
          }, 5000); // 5 second timeout
          
          const handleCanPlay = () => {
            clearTimeout(timeout);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
            resolve();
          };
          
          audioRef.current?.addEventListener('canplaythrough', handleCanPlay, { once: true });
        });

        try {
          await playPromise;
          await audioRef.current.play();
          toast({
            title: "Music playing",
            description: `Now playing: ${currentMusic.name}`,
          });
          setIsPlaying(true);
          return true;
        } catch (playError) {
          // If waiting times out, try to play anyway
          console.log('Attempting to play without full buffer');
          try {
            await audioRef.current.play();
            toast({
              title: "Music playing",
              description: `Now playing: ${currentMusic.name}`,
            });
            setIsPlaying(true);
            return true;
          } catch (finalError) {
            throw finalError;
          }
        }
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
