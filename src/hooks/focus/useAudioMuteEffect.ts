
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useAudioMuteEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    // Only run this effect if focus mode is active AND mute audio setting is explicitly enabled
    if (!isActive || !settings.muteAudio) {
      // If mute setting is disabled but focus mode is active, we may need to restore audio
      if (isActive) {
        console.log('Focus mode active but audio muting disabled');
        window.dispatchEvent(new CustomEvent('audioMutingChanged', { 
          detail: { 
            muted: false,
            forced: false,
            source: 'focus-mode-mute-disabled'
          } 
        }));
      }
      return;
    }

    console.log('Focus mode audio muting activated');
    
    // Store original muted states for all media elements
    const mediaElements = document.querySelectorAll('audio, video');
    const originalMutedStates = new Map();
    const originalPlaybackStates = new Map();
    
    // Special handling for the global audio player
    if (window.globalAudioPlayer) {
      originalMutedStates.set('globalAudioPlayer', window.globalAudioPlayer.muted);
      originalMutedStates.set('globalAudioPlayerVolume', window.globalAudioPlayer.volume);
      originalPlaybackStates.set('globalAudioPlayer', !window.globalAudioPlayer.paused);
      
      // Force pause and mute the global player only if mute setting is enabled
      if (!window.globalAudioPlayer.paused) {
        console.log('Pausing global audio player due to focus mode mute setting');
        window.globalAudioPlayer.pause();
      }
      window.globalAudioPlayer.muted = true;
      window.globalAudioPlayer.volume = 0;
      
      console.log('Global audio player muted and paused');
    }
    
    // Handle all other media elements
    mediaElements.forEach((element) => {
      const el = element as HTMLMediaElement;
      originalMutedStates.set(el, el.muted);
      originalPlaybackStates.set(el, !el.paused);
      
      if (!el.paused) {
        console.log('Pausing media element due to focus mode mute setting:', el);
        el.pause();
      }
      el.muted = true;
      el.volume = 0;
    });

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

    // Dispatch specific events for other components
    window.dispatchEvent(new CustomEvent('audioMutingChanged', { 
      detail: { 
        muted: true,
        forced: true,
        source: 'focus-mode' 
      } 
    }));

    return () => {
      console.log('Focus mode audio muting deactivated');
      
      // Only restore states if we're actually exiting focus mode or disabling the mute setting
      if (!isActive || !settings.muteAudio) {
        // Restore original muted states
        mediaElements.forEach((element) => {
          const el = element as HTMLMediaElement;
          const wasOriginallyMuted = originalMutedStates.get(el);
          
          if (el) {
            try {
              el.muted = wasOriginallyMuted || false;
            } catch (e) {
              console.error('Error accessing media element:', e);
            }
          }
        });
        
        // Restore global audio player state
        if (window.globalAudioPlayer) {
          window.globalAudioPlayer.muted = originalMutedStates.get('globalAudioPlayer') || false;
          window.globalAudioPlayer.volume = originalMutedStates.get('globalAudioPlayerVolume') || 0.2;
          console.log('Global audio player state restored');
        }
      }
      
      observer.disconnect();
      
      // Dispatch event to notify that forced muting has been deactivated
      window.dispatchEvent(new CustomEvent('audioMutingChanged', { 
        detail: { 
          muted: false,
          forced: false,
          source: 'focus-mode' 
        } 
      }));
    };
  }, [isActive, settings.muteAudio]);
};
