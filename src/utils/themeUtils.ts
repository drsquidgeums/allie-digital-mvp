
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

export const applyThemeColors = (colors: { background: string; text: string; button: string }) => {
  const root = document.documentElement;
  document.body.style.backgroundColor = colors.background;
  
  // Apply the new Allie Digital color scheme
  root.style.setProperty("--background", hexToHSL(colors.background));
  root.style.setProperty("--foreground", hexToHSL(colors.text));
  root.style.setProperty("--primary", "258 85% 76%"); // #a594f9
  root.style.setProperty("--primary-foreground", "0 0% 100%");
  root.style.setProperty("--secondary", "200 98% 39%"); // #0284c7
  root.style.setProperty("--secondary-foreground", "0 0% 100%");
  root.style.setProperty("--card", hexToHSL(colors.background));
  root.style.setProperty("--card-foreground", hexToHSL(colors.text));
  root.style.setProperty("--popover", hexToHSL(colors.background));
  root.style.setProperty("--popover-foreground", hexToHSL(colors.text));
  root.style.setProperty("--muted", "215 25% 17%"); // #1E293B
  root.style.setProperty("--muted-foreground", "220 13% 82%"); // #d1d5db
  root.style.setProperty("--accent", "215 25% 17%"); // #1E293B
  root.style.setProperty("--accent-foreground", "0 0% 100%");
  root.style.setProperty("--destructive", "0 84.2% 60.2%");
  root.style.setProperty("--destructive-foreground", "0 0% 100%");
  root.style.setProperty("--border", "240 10% 17%"); // #2A2A3C
  root.style.setProperty("--input", "240 10% 17%"); // #2A2A3C
  root.style.setProperty("--ring", "258 85% 76%"); // #a594f9
};
