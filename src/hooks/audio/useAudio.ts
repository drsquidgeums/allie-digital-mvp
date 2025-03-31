
import { useState, useEffect, useRef, useCallback } from 'react';
import { handleError } from '@/utils/errorHandling';

interface AudioOptions {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  onEnded?: () => void;
}

/**
 * Hook for managing audio playback with enhanced control and error handling
 */
export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  /**
   * Create and load an audio element
   */
  const loadAudio = useCallback((src: string, options: AudioOptions = {}) => {
    try {
      // Clean up any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      // Create new audio element
      const audio = new Audio(src);
      audio.volume = options.volume || volume;
      audio.playbackRate = options.playbackRate || 1;
      audio.loop = options.loop || false;
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (options.onEnded) {
          options.onEnded();
        }
      });
      
      audio.addEventListener('error', (e) => {
        handleError(e, {
          title: 'Audio Error',
          fallbackMessage: 'Failed to load audio file'
        });
      });
      
      audioRef.current = audio;
      return audio;
    } catch (error) {
      handleError(error, {
        title: 'Audio Error',
        fallbackMessage: 'Failed to create audio player'
      });
      return null;
    }
  }, [volume]);
  
  /**
   * Play audio from URL
   */
  const play = useCallback(async (src: string, options: AudioOptions = {}) => {
    try {
      const audio = loadAudio(src, options);
      if (!audio) return false;
      
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      return true;
    } catch (error) {
      handleError(error, {
        title: 'Playback Error',
        fallbackMessage: 'Failed to play audio'
      });
      return false;
    }
  }, [loadAudio]);
  
  /**
   * Play audio from Blob
   */
  const playBlob = useCallback(async (blob: Blob, options: AudioOptions = {}) => {
    try {
      const url = URL.createObjectURL(blob);
      const result = await play(url, {
        ...options,
        onEnded: () => {
          URL.revokeObjectURL(url);
          if (options.onEnded) options.onEnded();
        }
      });
      return result;
    } catch (error) {
      handleError(error, {
        title: 'Playback Error',
        fallbackMessage: 'Failed to play audio data'
      });
      return false;
    }
  }, [play]);
  
  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return true;
    }
    return false;
  }, [isPlaying]);
  
  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play()
        .then(() => {
          setIsPaused(false);
          setIsPlaying(true);
        })
        .catch(error => {
          handleError(error, {
            title: 'Playback Error',
            fallbackMessage: 'Failed to resume audio'
          });
        });
      return true;
    }
    return false;
  }, [isPaused]);
  
  /**
   * Stop playback and reset
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPaused(false);
      setIsPlaying(false);
      setCurrentTime(0);
      return true;
    }
    return false;
  }, []);
  
  /**
   * Seek to position
   */
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      return true;
    }
    return false;
  }, []);
  
  /**
   * Set playback volume
   */
  const setAudioVolume = useCallback((value: number) => {
    const normalizedVolume = Math.max(0, Math.min(1, value));
    setVolume(normalizedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
    }
  }, []);
  
  /**
   * Set playback rate
   */
  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      return true;
    }
    return false;
  }, []);
  
  // Clean up audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  return {
    isPlaying,
    isPaused,
    duration,
    currentTime,
    volume,
    play,
    playBlob,
    pause,
    resume,
    stop,
    seek,
    setVolume: setAudioVolume,
    setPlaybackRate
  };
};
