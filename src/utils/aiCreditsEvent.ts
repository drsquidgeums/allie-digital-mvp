// Dispatch this after any successful AI feature call to refresh credits indicators
export const notifyAICreditsUsed = () => {
  window.dispatchEvent(new CustomEvent("ai-credits-changed"));
};
