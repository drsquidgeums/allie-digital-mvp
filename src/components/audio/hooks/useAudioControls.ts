
import { useVolumeControl } from './useVolumeControl';
import { useLoopControl } from './useLoopControl';
import { usePlaybackControl } from './usePlaybackControl';
import { MusicOption } from '../MusicOptions';

export const useAudioControls = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  isFocusModeActive: boolean
) => {
  const { handleVolumeChange, toggleMute } = useVolumeControl(audioRef);
  const { toggleLoop } = useLoopControl(audioRef);
  const { togglePlay } = usePlaybackControl(audioRef, isPlaying, setIsPlaying, isFocusModeActive);

  return {
    handleVolumeChange,
    toggleMute,
    toggleLoop,
    togglePlay
  };
};
