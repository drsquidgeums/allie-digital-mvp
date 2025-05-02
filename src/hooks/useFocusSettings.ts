
export interface FocusSettings {
  blockNotifications?: boolean;
  blockPopups?: boolean;
  blockSocialMedia?: boolean;
  muteAudio?: boolean;
}

export const useFocusSettings = () => {
  const getDefaultSettings = (): FocusSettings => ({
    blockNotifications: true,
    blockPopups: true,
    blockSocialMedia: true,
    muteAudio: false,
  });

  return {
    getDefaultSettings
  };
};
