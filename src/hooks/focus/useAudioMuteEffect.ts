
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
      originalMutedStates.set('globalAudioPlayer', window.globalAudioPlayer.muted);
      originalMutedStates.set('globalAudioPlayerVolume', window.globalAudioPlayer.volume);
      originalPlaybackStates.set('globalAudioPlayer', !window.globalAudioPlayer.paused);
      
      // Force pause and mute the global player
      if (!window.globalAudioPlayer.paused) {
        console.log('Pausing global audio player due to focus mode');
        window.globalAudioPlayer.pause();
      }
      window.globalAudioPlayer.muted = true;
      window.globalAudioPlayer.volume = 0;
      
      console.log('Global audio player muted and paused');
    } else {
      console.log('No global audio player found');
    }
    
    // Handle all other media elements
    mediaElements.forEach((element) => {
      const el = element as HTMLMediaElement;
      originalMutedStates.set(el, el.muted);
      originalPlaybackStates.set(el, !el.paused);
      
      // Force pause and mute
      if (!el.paused) {
        console.log('Pausing media element due to focus mode:', el);
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

    // Dispatch an event to notify all components about focus mode change
    const event = new CustomEvent('focusModeChanged', { 
      detail: { 
        active: true, 
        settings: settings
      } 
    });
    window.dispatchEvent(event);
    
    // Dispatch a specific audio muting event with forced=true to ensure it takes effect
    const audioEvent = new CustomEvent('audioMutingChanged', { 
      detail: { 
        muted: true,
        forced: true,
        source: 'focus-mode' 
      } 
    });
    window.dispatchEvent(audioEvent);

    return () => {
      console.log('Focus mode audio muting deactivated');
      
      // Restore original muted states
      mediaElements.forEach((element) => {
        const el = element as HTMLMediaElement;
        const wasOriginallyMuted = originalMutedStates.get(el);
        
        if (el) {
          try {
            el.muted = wasOriginallyMuted || false;
            // Don't automatically resume playback, let the audio components handle this
          } catch (e) {
            console.error('Error accessing media element:', e);
          }
        }
      });
      
      // Restore global audio player state
      if (window.globalAudioPlayer) {
        window.globalAudioPlayer.muted = originalMutedStates.get('globalAudioPlayer') || false;
        window.globalAudioPlayer.volume = originalMutedStates.get('globalAudioPlayerVolume') || 0.2;
        // Don't automatically resume the global audio player
        console.log('Global audio player state restored but not automatically resumed');
      }
      
      observer.disconnect();
      
      // Dispatch events to notify that focus mode has been deactivated
      const audioEvent = new CustomEvent('audioMutingChanged', { 
        detail: { 
          muted: false,
          forced: false,
          source: 'focus-mode' 
        } 
      });
      window.dispatchEvent(audioEvent);

      const focusModeEvent = new CustomEvent('focusModeChanged', { 
        detail: { 
          active: false,
          settings: null
        } 
      });
      window.dispatchEvent(focusModeEvent);
    };
  }, [isActive, settings.muteAudio]);
};
