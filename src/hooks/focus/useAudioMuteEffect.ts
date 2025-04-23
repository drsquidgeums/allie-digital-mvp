
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
    
    // Dispatch an event that other components can listen for
    window.dispatchEvent(new CustomEvent('audioMutingChanged', {
      detail: {
        muted: true,
        forced: true,
        source: 'focus-mode'
      }
    }));
    
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
      
      // Dispatch an event when muting is deactivated
      window.dispatchEvent(new CustomEvent('audioMutingChanged', {
        detail: {
          muted: false,
          forced: false,
          source: 'focus-mode'
        }
      }));
      
      observer.disconnect();
    };
  }, [isActive, settings.muteAudio]);
};
