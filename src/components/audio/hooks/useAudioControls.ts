
import { useVolumeControl } from './useVolumeControl';
import { useLoopControl } from './useLoopControl';
import { usePlaybackControl } from './usePlaybackControl';
import { MusicOption } from '../MusicOptions';
import { useFocusMode } from '@/hooks/useFocusMode';

export const useAudioControls = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  isFocusModeActive: boolean
) => {
  const { focusModeSettings } = useFocusMode();
  const focusModeBlocksAudio = isFocusModeActive && focusModeSettings?.muteAudio;
  
  const { handleVolumeChange, toggleMute } = useVolumeControl(audioRef);
  const { toggleLoop } = useLoopControl(audioRef);
  const { togglePlay } = usePlaybackControl(audioRef, isPlaying, setIsPlaying, focusModeBlocksAudio);

  return {
    handleVolumeChange,
    toggleMute,
    toggleLoop,
    togglePlay
  };
};
