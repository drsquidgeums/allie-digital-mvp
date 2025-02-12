
import { useState, useEffect } from 'react';

export interface FocusSettings {
  blockNotifications: boolean;
  blockPopups: boolean;
  blockSocialMedia: boolean;
  enablePomodoro: boolean;
  muteAudio: boolean;
}

export const useFocusSettings = () => {
  const [settings, setSettings] = useState<FocusSettings>({
    blockNotifications: true,
    blockPopups: true,
    blockSocialMedia: false,
    enablePomodoro: false,
    muteAudio: false,
  });

  const updateSetting = (key: keyof FocusSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
};
