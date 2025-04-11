
/**
 * TypeScript definitions for PDFium Viewer
 */
interface PDFiumViewerOptions {
  container: HTMLElement;
  url: string;
  scale?: number;
  renderType?: 'canvas' | 'svg';
  backgroundColor?: string;
  cMapUrl?: string;
  password?: string;
}

declare class PDFiumViewer {
  constructor(options: PDFiumViewerOptions);
  init(): Promise<void>;
  goToPage(pageNumber: number): void;
  nextPage(): void;
  prevPage(): void;
  setScale(scale: number): void;
  getPageCount(): number;
  getCurrentPage(): number;
  destroy(): void;
}

interface Window {
  PDFiumViewer: typeof PDFiumViewer;
}
