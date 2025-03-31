
import { useToast } from '@/hooks/use-toast';

export const useLoopControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const { toast } = useToast();

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

  return {
    toggleLoop
  };
};
