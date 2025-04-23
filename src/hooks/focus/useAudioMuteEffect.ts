
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useAudioMuteEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    // Only run this effect if focus mode is active AND mute audio setting is enabled
    if (!isActive || !settings.muteAudio) return;

    console.log('Focus mode audio muting activated');
    
    // Store original muted states for all media elements
    const mediaElements = document.querySelectorAll('audio, video');
    const originalMutedStates = new Map();
    const originalPlaybackStates = new Map();
    
    // Special handling for the global audio player
    if (window.globalAudioPlayer) {
      console.log('Global audio player exists, preserving its state');
      return; // Do nothing if globalAudioPlayer exists, preserving its current state
    }
    
    // Handle dynamically added audio/video elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if ((node as Element).tagName === 'AUDIO' || (node as Element).tagName === 'VIDEO') {
              const mediaEl = node as HTMLMediaElement;
              originalMutedStates.set(mediaEl, mediaEl.muted);
              originalPlaybackStates.set(mediaEl, !mediaEl.paused);
              mediaEl.muted = true;
              mediaEl.volume = 0;
              mediaEl.pause();
              console.log('Muted and paused dynamically added audio/video element');
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      console.log('Focus mode audio muting cleanup');
      observer.disconnect();
    };
  }, [isActive, settings.muteAudio]);
};
