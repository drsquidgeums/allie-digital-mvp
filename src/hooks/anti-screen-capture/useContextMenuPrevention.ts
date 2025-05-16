
export const useContextMenuPrevention = (isEnabled: boolean) => {
  if (!isEnabled) return { disableContextMenu: () => {} };
  
  // Disable context menu to prevent "Save Image" actions
  const disableContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return { disableContextMenu };
};
