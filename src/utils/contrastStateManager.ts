
type ContrastStateListener = (isHighContrast: boolean) => void;

class ContrastStateManager {
  private listeners: Set<ContrastStateListener>;
  public isHighContrast: boolean;

  constructor() {
    this.listeners = new Set();
    this.isHighContrast = localStorage.getItem('isHighContrastEnabled') === 'true';
    if (this.isHighContrast) {
      this.applyContrastStyling();
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
    this.applyContrastStyling();
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isHighContrast));
  }

  public applyContrastStyling(): void {
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
    } else {
      // Reset to default theme values
      document.documentElement.style.setProperty('--background', 'hsl(0 0% 98%)');
      document.documentElement.style.setProperty('--foreground', 'hsl(240 10% 3.9%)');
      document.documentElement.style.setProperty('--card', 'hsl(0 0% 100%)');
      document.documentElement.style.setProperty('--card-foreground', 'hsl(240 10% 3.9%)');
      document.documentElement.style.setProperty('--popover', 'hsl(0 0% 100%)');
      document.documentElement.style.setProperty('--popover-foreground', 'hsl(240 10% 3.9%)');
      document.documentElement.style.setProperty('--primary', 'hsl(240 5.9% 10%)');
      document.documentElement.style.setProperty('--primary-foreground', 'hsl(0 0% 98%)');
      document.documentElement.style.setProperty('--secondary', 'hsl(240 5.9% 90%)');
      document.documentElement.style.setProperty('--secondary-foreground', 'hsl(240 5.9% 10%)');
      document.documentElement.style.setProperty('--muted', 'hsl(240 4.8% 90%)');
      document.documentElement.style.setProperty('--muted-foreground', 'hsl(240 5% 64.9%)');
      document.documentElement.style.setProperty('--accent', 'hsl(240 4.8% 90%)');
      document.documentElement.style.setProperty('--accent-foreground', 'hsl(240 5.9% 10%)');
      document.documentElement.style.setProperty('--border', 'hsl(240 5.9% 90%)');
    }
  }
}

export const globalContrastState = new ContrastStateManager();
