
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
        
        // Test if URL is accessible before setting
        try {
          const response = await fetch(currentMusic.url, { 
            method: 'HEAD',
            mode: 'no-cors'
          });
          console.log('URL test response:', response.status);
        } catch (urlError) {
          console.log('URL test failed (expected for streaming):', urlError);
          // This is expected for streaming URLs due to CORS
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
            // Also accept canplaythrough as ready
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
          
          // Reduced timeout to 3 seconds for faster feedback
          timeoutId = setTimeout(() => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
            reject(new Error('Audio loading timeout'));
          }, 3000);
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
      
      // More specific error messages
      let errorMessage = "Unable to play the selected music.";
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = "The audio stream is taking too long to load. Please try another option.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error - please check your connection and try again.";
        }
      }
      
      toast({
        title: "Playback failed",
        description: errorMessage,
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
