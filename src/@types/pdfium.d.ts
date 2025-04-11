
declare module 'pdfium-viewer' {
  export interface PDFiumViewerOptions {
    container: HTMLElement;
    url?: string;
    file?: File;
    scale?: number;
    renderType?: 'canvas' | 'svg';
    backgroundColor?: string;
    cMapUrl?: string;
    password?: string;
    onError?: (error: Error) => void;
  }

  export default class PDFiumViewer {
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
}
