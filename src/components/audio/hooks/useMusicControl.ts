
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MusicOption } from '../MusicOptions';

export const useMusicControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [wasPausedByFocusMode, setWasPausedByFocusMode] = useState(false);
  const { toast } = useToast();

  // Listen for focus mode changes
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active, settings } = event.detail;
      const wasInFocusMode = isFocusModeActive;
      const shouldMuteAudio = active && settings?.muteAudio;
      
      console.log('Focus mode change detected in music control:', { active, settings, shouldMuteAudio });
      
      setIsFocusModeActive(shouldMuteAudio);
      
      if (shouldMuteAudio && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setWasPausedByFocusMode(true);
        setIsPlaying(false);
        console.log('Audio paused due to focus mode activation with mute setting');
        
        toast({
          title: "Music paused",
          description: "Music playback paused due to Focus Mode",
        });
      } else if (!active && wasPausedByFocusMode && wasInFocusMode) {
        setWasPausedByFocusMode(false);
        if (audioRef.current?.paused) {
          console.log('Music control aware of focus mode deactivation');
        }
      }
    };
    
    // Listen for specific audio muting events
    const handleAudioMutingChanged = (event: CustomEvent) => {
      const { muted } = event.detail;
      
      console.log('Audio muting event in music control:', { muted });
      
      if (muted && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
        setWasPausedByFocusMode(true);
        console.log('Audio paused due to audio muting event');
        
        toast({
          title: "Music paused",
          description: "Music playback paused due to Audio Muting",
        });
      }
    };
    
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, isFocusModeActive, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onerror = (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
        toast({
          title: "Playback error",
          description: "Unable to play the selected music. Please try another option.",
          variant: "destructive",
        });
      };

      setIsPlaying(!audioRef.current.paused);
      setVolume(audioRef.current.volume);
      setIsMuted(audioRef.current.muted);
      setIsLooping(audioRef.current.loop);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onerror = null;
      }
    };
  }, [toast]);

  // Update playing state when audio events occur
  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      console.log('Audio play detected, updating state');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('Audio pause detected, updating state');
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
    };
  }, [audioRef]);

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    const normalizedVolume = newVolume / 100;
    audioRef.current.volume = normalizedVolume;
    setVolume(normalizedVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !audioRef.current.loop;
    setIsLooping(!isLooping);
    toast({
      title: isLooping ? "Loop disabled" : "Loop enabled",
      description: isLooping ? "Music will stop after playing once" : "Music will play continuously",
    });
  };

  const togglePlay = async (currentMusic: MusicOption | undefined) => {
    if (!audioRef.current || !currentMusic) {
      toast({
        title: "Please select a music option",
        description: "Choose from the available music options to play",
      });
      return;
    }

    // Check if we're in focus mode with mute audio enabled
    if (isFocusModeActive) {
      toast({
        title: "Cannot play audio",
        description: "Audio is muted due to Focus Mode. Exit Focus Mode or disable 'Mute Audio' setting to play music.",
        variant: "destructive",
      });
      return;
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
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback failed",
        description: "Unable to play the selected music. Please try another option.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    setIsPlaying,
    togglePlay,
    setVolume: handleVolumeChange,
    toggleMute,
    toggleLoop,
  };
};
