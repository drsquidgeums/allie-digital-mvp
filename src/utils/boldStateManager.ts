
type BoldStateListener = (isBold: boolean) => void;

class BoldStateManager {
  private listeners: Set<BoldStateListener>;
  public isBold: boolean;

  constructor() {
    this.listeners = new Set();
    this.isBold = localStorage.getItem('isBoldEnabled') === 'true';
    // Only apply initial styling if bold was previously enabled
    if (this.isBold) {
      this.applyBoldStyling();
    }
  }

  subscribe(listener: BoldStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setBold(value: boolean): void {
    this.isBold = value;
    localStorage.setItem('isBoldEnabled', value.toString());
    this.applyBoldStyling();
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isBold));
  }

  public applyBoldStyling(): void {
    document.documentElement.style.setProperty('--font-weight', this.isBold ? 'bold' : 'normal');
    const allTextElements = document.querySelectorAll<HTMLElement>('p, span, a, h1, h2, h3, h4, h5, h6, div, button, label, input, textarea');
    allTextElements.forEach(element => {
      // Only apply bold if it's enabled
      if (this.isBold) {
        element.style.fontWeight = 'bold';
      } else {
        // Remove the inline style to let the default font weight take effect
        element.style.removeProperty('font-weight');
      }
    });
  }
}

export const globalBoldState = new BoldStateManager();
