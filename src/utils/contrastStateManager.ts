
type ContrastStateListener = (isHighContrast: boolean) => void;

class ContrastStateManager {
  private listeners: Set<ContrastStateListener>;
  public isHighContrast: boolean;

  constructor() {
    this.listeners = new Set();
    this.isHighContrast = localStorage.getItem('isHighContrastEnabled') === 'true';
    if (this.isHighContrast) {
      this.applyContrastStyling();
    } else {
      this.removeContrastStyling();
    }
  }

  subscribe(listener: ContrastStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setHighContrast(value: boolean): void {
    this.isHighContrast = value;
    localStorage.setItem('isHighContrastEnabled', value.toString());
    if (value) {
      this.applyContrastStyling();
    } else {
      this.removeContrastStyling();
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isHighContrast));
  }

  private removeContrastStyling(): void {
    document.documentElement.style.removeProperty('--background');
    document.documentElement.style.removeProperty('--foreground');
    document.documentElement.style.removeProperty('--card');
    document.documentElement.style.removeProperty('--card-foreground');
    document.documentElement.style.removeProperty('--popover');
    document.documentElement.style.removeProperty('--popover-foreground');
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-foreground');
    document.documentElement.style.removeProperty('--secondary');
    document.documentElement.style.removeProperty('--secondary-foreground');
    document.documentElement.style.removeProperty('--muted');
    document.documentElement.style.removeProperty('--muted-foreground');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-foreground');
    document.documentElement.style.removeProperty('--border');
  }

  private applyContrastStyling(): void {
    if (this.isHighContrast) {
      document.documentElement.style.setProperty('--background', '#000000');
      document.documentElement.style.setProperty('--foreground', '#FFFFFF');
      document.documentElement.style.setProperty('--card', '#000000');
      document.documentElement.style.setProperty('--card-foreground', '#FFFFFF');
      document.documentElement.style.setProperty('--popover', '#000000');
      document.documentElement.style.setProperty('--popover-foreground', '#FFFFFF');
      document.documentElement.style.setProperty('--primary', '#FFFFFF');
      document.documentElement.style.setProperty('--primary-foreground', '#000000');
      document.documentElement.style.setProperty('--secondary', '#FFFFFF');
      document.documentElement.style.setProperty('--secondary-foreground', '#000000');
      document.documentElement.style.setProperty('--muted', '#FFFFFF');
      document.documentElement.style.setProperty('--muted-foreground', '#000000');
      document.documentElement.style.setProperty('--accent', '#FFFFFF');
      document.documentElement.style.setProperty('--accent-foreground', '#000000');
      document.documentElement.style.setProperty('--border', '#FFFFFF');
    }
  }
}

export const globalContrastState = new ContrastStateManager();
