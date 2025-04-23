
import React from "react";
import { FocusSettingSwitch } from "./FocusSettingSwitch";
import { useFocusSettings } from "@/hooks/useFocusSettings";

export const FocusSettings = () => {
  const { settings, updateSetting } = useFocusSettings();

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground mb-1 p-1 bg-muted/30 rounded-md">
        <p>Select which distractions to block. These selections will only activate when you click 'Enter Focus Mode'.</p>
      </div>
    
      <FocusSettingSwitch
        label="Block Notifications"
        description="Block browser notifications during focus mode"
        checked={settings.blockNotifications}
        onCheckedChange={(checked) => updateSetting('blockNotifications', checked)}
      />

      <FocusSettingSwitch
        label="Block Popups"
        description="Prevent popup dialogs and alerts during focus mode"
        checked={settings.blockPopups}
        onCheckedChange={(checked) => updateSetting('blockPopups', checked)}
      />

      <FocusSettingSwitch
        label="Block Social Media"
        description="Hide elements tagged as social media during focus mode"
        checked={settings.blockSocialMedia}
        onCheckedChange={(checked) => updateSetting('blockSocialMedia', checked)}
      />

      <FocusSettingSwitch
        label="Mute Audio"
        description="Mute all audio and video elements during focus mode (disables ambient music player)"
        checked={settings.muteAudio}
        onCheckedChange={(checked) => updateSetting('muteAudio', checked)}
      />
    </div>
  );
};
