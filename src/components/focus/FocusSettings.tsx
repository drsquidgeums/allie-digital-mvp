import React from "react";
import { FocusSettingSwitch } from "./FocusSettingSwitch";
import { useFocusSettings } from "@/hooks/useFocusSettings";

export const FocusSettings = () => {
  const { settings, updateSetting } = useFocusSettings();

  return (
    <div className="space-y-4">
      <FocusSettingSwitch
        label="Block Notifications"
        description="Mute all notifications during focus mode"
        checked={settings.blockNotifications}
        onCheckedChange={(checked) => updateSetting('blockNotifications', checked)}
      />

      <FocusSettingSwitch
        label="Fullscreen Mode"
        description="Enter fullscreen during focus mode"
        checked={settings.fullscreen}
        onCheckedChange={(checked) => updateSetting('fullscreen', checked)}
      />

      <FocusSettingSwitch
        label="Block Popups"
        description="Prevent popup dialogs during focus mode"
        checked={settings.blockPopups}
        onCheckedChange={(checked) => updateSetting('blockPopups', checked)}
      />

      <FocusSettingSwitch
        label="Block Social Media"
        description="Hide social media elements during focus mode"
        checked={settings.blockSocialMedia}
        onCheckedChange={(checked) => updateSetting('blockSocialMedia', checked)}
      />

      <FocusSettingSwitch
        label="Enable Pomodoro"
        description="Automatically start a Pomodoro timer"
        checked={settings.enablePomodoro}
        onCheckedChange={(checked) => updateSetting('enablePomodoro', checked)}
      />

      <FocusSettingSwitch
        label="Dim Background"
        description="Slightly dim the background for better focus"
        checked={settings.dimBackground}
        onCheckedChange={(checked) => updateSetting('dimBackground', checked)}
      />

      <FocusSettingSwitch
        label="Mute Audio"
        description="Mute all audio during focus mode"
        checked={settings.muteAudio}
        onCheckedChange={(checked) => updateSetting('muteAudio', checked)}
      />
    </div>
  );
};