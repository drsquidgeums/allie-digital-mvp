
import { useToast } from '@/hooks/use-toast';

export const useVolumeControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
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

  return {
    handleVolumeChange,
    toggleMute
  };
};
