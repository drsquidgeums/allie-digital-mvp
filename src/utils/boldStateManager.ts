
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
    if (this.isBold) {
      document.documentElement.classList.add('global-bold');
    } else {
      document.documentElement.classList.remove('global-bold');
    }
  }
}

export const globalBoldState = new BoldStateManager();
