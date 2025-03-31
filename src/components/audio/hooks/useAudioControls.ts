
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useAudioControls = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  isFocusModeActive: boolean
) => {
  const { toast } = useToast();

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    const normalizedVolume = newVolume / 100;
    audioRef.current.volume = normalizedVolume;
    return normalizedVolume;
  };

  const toggleMute = () => {
    if (!audioRef.current) return false;
    audioRef.current.muted = !audioRef.current.muted;
    return audioRef.current.muted;
  };

  const toggleLoop = () => {
    if (!audioRef.current) return false;
    audioRef.current.loop = !audioRef.current.loop;
    const newLoopState = audioRef.current.loop;
    
    toast({
      title: newLoopState ? "Loop enabled" : "Loop disabled",
      description: newLoopState ? "Music will play continuously" : "Music will stop after playing once",
    });
    
    return newLoopState;
  };

  const togglePlay = async (currentMusic: MusicOption | undefined) => {
    if (!audioRef.current || !currentMusic) {
      toast({
        title: "Please select a music option",
        description: "Choose from the available music options to play",
      });
      return false;
    }

    // Check if we're in focus mode with mute audio enabled
    if (isFocusModeActive) {
      toast({
        title: "Cannot play audio",
        description: "Audio is muted due to Focus Mode. Exit Focus Mode or disable 'Mute Audio' setting to play music.",
        variant: "destructive",
      });
      return false;
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
        // Only set new source if we're starting playback
        if (audioRef.current.paused) {
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
    handleVolumeChange,
    toggleMute,
    toggleLoop,
    togglePlay
  };
};
