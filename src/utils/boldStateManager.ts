type BoldStateListener = (isBold: boolean) => void;

class BoldStateManager {
  private listeners: Set<BoldStateListener>;
  public isBold: boolean;

  constructor() {
    this.listeners = new Set();
    this.isBold = localStorage.getItem('isBoldEnabled') === 'true';
    this.applyBoldStyling();
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
      element.style.fontWeight = this.isBold ? 'bold' : 'normal';
    });
  }
}

export const globalBoldState = new BoldStateManager();