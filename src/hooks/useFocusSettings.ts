
import { useState, useEffect } from 'react';

export interface FocusSettings {
  blockNotifications: boolean;
  blockPopups: boolean;
  blockSocialMedia: boolean;
  muteAudio: boolean;
}

const FOCUS_SETTINGS_KEY = 'focus_settings';

export const useFocusSettings = () => {
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
    
    // Default settings if none found - all turned off by default
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

  const updateSetting = (key: keyof FocusSettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };

  return { settings, updateSetting };
};
