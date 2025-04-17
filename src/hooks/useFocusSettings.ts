
import { useState, useEffect } from 'react';
import { useFocusMode } from './useFocusMode';

export interface FocusSettings {
  blockNotifications: boolean;
  blockPopups: boolean;
  blockSocialMedia: boolean;
  muteAudio: boolean;
}

const FOCUS_SETTINGS_KEY = 'focus_settings';

export const useFocusSettings = () => {
  const { isFocusModeActive } = useFocusMode();
  const [settings, setSettings] = useState<FocusSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem(FOCUS_SETTINGS_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved focus settings:', e);
      }
    }
    
    // Default settings - all turned off by default
    return {
      blockNotifications: false,
      blockPopups: false,
      blockSocialMedia: false,
      muteAudio: false,
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FOCUS_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply settings immediately when they change during active focus mode
  useEffect(() => {
    if (isFocusModeActive) {
      console.log('Focus mode settings changed while active:', settings);
      
      // Re-dispatch the focus mode event with updated settings
      window.dispatchEvent(new CustomEvent('focusModeChanged', { 
        detail: { 
          active: true,
          settings
        } 
      }));
      
      // Handle audio muting specifically
      window.dispatchEvent(new CustomEvent('audioMutingChanged', { 
        detail: { 
          muted: settings.muteAudio,
          forced: true,
          source: 'focus-mode-settings-changed'
        } 
      }));
    }
  }, [settings, isFocusModeActive]);

  const updateSetting = (key: keyof FocusSettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };

  return { settings, updateSetting };
};
