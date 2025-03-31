
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useAudioMuteEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
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
      
      // Ensure the audio is properly muted and paused
      window.globalAudioPlayer.muted = true;
      if (!window.globalAudioPlayer.paused) {
        console.log('Pausing global audio player due to focus mode');
        window.globalAudioPlayer.pause();
      }
      
      console.log('Global audio player muted and paused');
    } else {
      console.log('No global audio player found');
    }
    
    // Handle all other media elements
    mediaElements.forEach((element) => {
      const el = element as HTMLMediaElement;
      originalMutedStates.set(el, el.muted);
      originalPlaybackStates.set(el, !el.paused);
      el.muted = true;
      
      // Also pause the media to ensure it's fully silenced
      if (!el.paused) {
        console.log('Pausing media element due to focus mode:', el);
        el.pause();
      }
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
              mediaEl.pause();
              console.log('Muted and paused dynamically added audio/video element');
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Dispatch an event to notify all components about audio muting
    const event = new CustomEvent('focusModeChanged', { 
      detail: { 
        active: true, 
        settings: settings
      } 
    });
    window.dispatchEvent(event);
    
    // Also dispatch a specific audio muting event
    const audioEvent = new CustomEvent('audioMutingChanged', { detail: { muted: true } });
    window.dispatchEvent(audioEvent);

    return () => {
      console.log('Focus mode audio muting deactivated');
      
      // Restore original muted states
      mediaElements.forEach((element) => {
        const el = element as HTMLMediaElement;
        const wasOriginallyMuted = originalMutedStates.get(el);
        const wasPlaying = originalPlaybackStates.get(el);
        
        el.muted = wasOriginallyMuted || false;
        
        // Resume playback if element was playing originally
        if (wasPlaying) {
          console.log('Resuming media element that was previously playing:', el);
          el.play().catch(e => console.error('Error resuming media element:', e));
        }
      });
      
      // Restore global audio player state
      if (window.globalAudioPlayer) {
        window.globalAudioPlayer.muted = originalMutedStates.get('globalAudioPlayer') || false;
        window.globalAudioPlayer.volume = originalMutedStates.get('globalAudioPlayerVolume') || 0.2;
        
        // Resume the global audio player if it was playing before
        if (originalPlaybackStates.get('globalAudioPlayer')) {
          console.log('Resuming global audio player that was previously playing');
          window.globalAudioPlayer.play().catch(e => console.error('Error resuming global audio player:', e));
        }
        
        console.log('Global audio player state restored');
      }
      
      observer.disconnect();
      
      // Dispatch an event to notify all components about audio unmuting
      const event = new CustomEvent('audioMutingChanged', { detail: { muted: false } });
      window.dispatchEvent(event);

      // Dispatch focus mode changed event for deactivation
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
