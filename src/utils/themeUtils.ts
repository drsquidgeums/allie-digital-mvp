export const hexToHSL = (hex: string) => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Calculate contrasting color for buttons based on background
const getContrastColor = (bgColor: string): string => {
  const hex = bgColor.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const applyThemeColors = (colors: { background: string; text: string; sidebar: string }) => {
  const root = document.documentElement;
  document.body.style.backgroundColor = colors.background;
  
  // Calculate button colors based on text and background
  const buttonBg = colors.text;
  const buttonText = getContrastColor(buttonBg);
  
  // Apply colors to all major theme variables
  root.style.setProperty("--background", hexToHSL(colors.background));
  root.style.setProperty("--foreground", hexToHSL(colors.text));
  root.style.setProperty("--card", hexToHSL(colors.sidebar));
  root.style.setProperty("--card-foreground", hexToHSL(colors.text));
  root.style.setProperty("--popover", hexToHSL(colors.sidebar));
  root.style.setProperty("--popover-foreground", hexToHSL(colors.text));
  
  // Set button colors
  root.style.setProperty("--primary", hexToHSL(buttonBg));
  root.style.setProperty("--primary-foreground", hexToHSL(buttonText));
  
  // Set secondary colors for hover states
  root.style.setProperty("--secondary", hexToHSL(colors.sidebar));
  root.style.setProperty("--secondary-foreground", hexToHSL(colors.text));
  
  // Set other theme colors
  root.style.setProperty("--muted", hexToHSL(colors.background));
  root.style.setProperty("--muted-foreground", hexToHSL(colors.text));
  root.style.setProperty("--accent", hexToHSL(colors.sidebar));
  root.style.setProperty("--accent-foreground", hexToHSL(colors.text));
  root.style.setProperty("--destructive", "0 84.2% 60.2%");
  root.style.setProperty("--destructive-foreground", "0 0% 98%");
  root.style.setProperty("--border", hexToHSL(colors.sidebar));
  root.style.setProperty("--input", hexToHSL(colors.sidebar));
  root.style.setProperty("--ring", hexToHSL(colors.text));
};