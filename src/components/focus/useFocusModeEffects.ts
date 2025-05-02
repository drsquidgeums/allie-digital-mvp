
import { useVisibilityEffect } from "@/hooks/focus/useVisibilityEffect";
import { useSocialMediaBlockEffect } from "@/hooks/focus/useSocialMediaBlockEffect";
import { useAudioMuteEffect } from "@/hooks/focus/useAudioMuteEffect";
import { useNotificationBlockEffect } from "@/hooks/focus/useNotificationBlockEffect";
import { usePopupBlockEffect } from "@/hooks/focus/usePopupBlockEffect";
import { useEmailBlockEffect } from "@/hooks/focus/useEmailBlockEffect";
import { useMessagingBlockEffect } from "@/hooks/focus/useMessagingBlockEffect";
import { useMinimizeUIEffect } from "@/hooks/focus/useMinimizeUIEffect";
import { FocusSettings } from "@/hooks/useFocusSettings";
import { useAnalytics } from "@/hooks/focus/useAnalytics";
import { useScreenDimmer } from "@/hooks/focus/useScreenDimmer";

/**
 * Custom hook that applies all focus mode effects based on settings
 * 
 * This hook coordinates all the individual focus mode effects by activating
 * each one based on the current focus mode state and settings.
 * 
 * @param isActive - Whether focus mode is currently active
 * @param settings - The current focus mode settings
 */
export const useFocusModeEffects = (isActive: boolean, settings: FocusSettings) => {
  // Core blocking effects
  useVisibilityEffect(isActive, settings);
  useSocialMediaBlockEffect(isActive, settings);
  useAudioMuteEffect(isActive, settings);
  useNotificationBlockEffect(isActive, settings);
  usePopupBlockEffect(isActive, settings);
  useEmailBlockEffect(isActive, settings);
  useMessagingBlockEffect(isActive, settings);
  
  // UI enhancement effects
  useMinimizeUIEffect(isActive, settings);
  useScreenDimmer(isActive, settings);
  
  // Analytics and tracking
  useAnalytics(isActive, settings);
};
