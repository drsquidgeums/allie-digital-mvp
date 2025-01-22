type BoldStateListener = (isBold: boolean) => void;

class BoldStateManager {
  private listeners: Set<BoldStateListener>;
  public isBold: boolean;

  constructor() {
    this.listeners = new Set();
    this.isBold = localStorage.getItem('isBoldEnabled') === 'true';
  }

  subscribe(listener: BoldStateListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setBold(value: boolean) {
    this.isBold = value;
    localStorage.setItem('isBoldEnabled', value.toString());
    this.applyBoldStyling();
    this.listeners.forEach(listener => listener(value));
  }

  private applyBoldStyling() {
    document.documentElement.style.setProperty('--font-weight', this.isBold ? 'bold' : 'normal');
    const allTextElements = document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6, div, button, label, input, textarea');
    allTextElements.forEach(element => {
      (element as HTMLElement).style.fontWeight = this.isBold ? 'bold' : 'normal';
    });
  }
}

export const globalBoldState = new BoldStateManager();
globalBoldState.applyBoldStyling();