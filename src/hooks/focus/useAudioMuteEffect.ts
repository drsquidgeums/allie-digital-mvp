import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useAudioMuteEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    // Don't mute audio in focus mode anymore - returning early
    if (!isActive || !settings.muteAudio) return;

    console.log('Focus mode audio muting activated');
    
    // Store original muted states for all media elements
    const mediaElements = document.querySelectorAll('audio, video');
    const originalMutedStates = new Map();
    const originalPlaybackStates = new Map();
    
    // Special handling for the global audio player - we're keeping it active
    if (window.globalAudioPlayer) {
      // Don't mute or pause the global audio player
      console.log('Global audio player will remain active during focus mode');
    }
    
    // Dispatch a specific audio muting event with forced=false for ambient music
    const audioEvent = new CustomEvent('audioMutingChanged', { 
      detail: { 
        muted: false,
        forced: false,
        source: 'focus-mode' 
      } 
    });
    window.dispatchEvent(audioEvent);

    return () => {
      console.log('Focus mode audio muting deactivated');
      
      // Dispatch events to notify that focus mode has been deactivated
      const audioEvent = new CustomEvent('audioMutingChanged', { 
        detail: { 
          muted: false,
          forced: false,
          source: 'focus-mode' 
        } 
      });
      window.dispatchEvent(audioEvent);
    };
  }, [isActive, settings.muteAudio]);
};
