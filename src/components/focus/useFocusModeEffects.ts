
import { useVisibilityEffect } from "@/hooks/focus/useVisibilityEffect";
import { useSocialMediaBlockEffect } from "@/hooks/focus/useSocialMediaBlockEffect";
import { useAudioMuteEffect } from "@/hooks/focus/useAudioMuteEffect";
import { useNotificationBlockEffect } from "@/hooks/focus/useNotificationBlockEffect";
import { usePopupBlockEffect } from "@/hooks/focus/usePopupBlockEffect";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useFocusModeEffects = (isActive: boolean, settings: FocusSettings) => {
  // Apply all focus mode effects
  useVisibilityEffect(isActive, settings);
  useSocialMediaBlockEffect(isActive, settings);
  useAudioMuteEffect(isActive, settings);
  useNotificationBlockEffect(isActive, settings);
  usePopupBlockEffect(isActive, settings);
};
