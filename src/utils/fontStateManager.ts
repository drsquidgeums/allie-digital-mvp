type FontStateListener = (font: string) => void;

class FontStateManager {
  private listeners: Set<FontStateListener>;
  public selectedFont: string;

  constructor() {
    this.listeners = new Set();
    this.selectedFont = localStorage.getItem('selectedFont') || 'system-ui';
    // Apply initial font if one was previously selected
    if (this.selectedFont !== 'system-ui') {
      this.applyFontStyling();
    }
  }

  subscribe(listener: FontStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setFont(value: string): void {
    this.selectedFont = value;
    localStorage.setItem('selectedFont', value);
    this.applyFontStyling();
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.selectedFont));
  }

  public applyFontStyling(): void {
    // Apply font to CSS variable
    document.documentElement.style.setProperty('--font-family', this.selectedFont);
    
    // Apply font to all text elements
    const allTextElements = document.querySelectorAll<HTMLElement>('p, span, a, h1, h2, h3, h4, h5, h6, div, button, label, input, textarea');
    allTextElements.forEach(element => {
      if (this.selectedFont !== 'system-ui') {
        element.style.fontFamily = this.selectedFont;
      } else {
        // Remove the inline style to let the default font take effect
        element.style.removeProperty('font-family');
      }
    });
  }
}

export const globalFontState = new FontStateManager();