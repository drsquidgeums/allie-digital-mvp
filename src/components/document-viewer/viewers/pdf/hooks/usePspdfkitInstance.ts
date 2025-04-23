
import { useEffect, useRef, useState } from 'react';
import usePspdfKit from '@/components/document-viewer/hooks/usePspdfKit';

interface UsePspdfkitInstanceProps {
  file: File | null;
  url: string;
  onReady?: (instance: any) => void;
  onError?: (err: Error) => void;
}

export const usePspdfkitInstance = ({ file, url, onReady, onError }: UsePspdfkitInstanceProps) => {
  const { isReady: sdkReady, error: sdkError } = usePspdfKit();
  const [instance, setInstance] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let localInstance: any = null;

    const loadPdf = async () => {
      if (!containerRef.current || !sdkReady) return;

      containerRef.current.innerHTML = '';
      try {
        const PSPDFKit = await import('pspdfkit');
        let source;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          source = { data: new Uint8Array(arrayBuffer) };
        } else if (url) {
          source = { url };
        } else {
          return;
        }

        localInstance = await PSPDFKit.load({
          container: containerRef.current,
          document: source,
          baseUrl: `${window.location.protocol}//${window.location.host}/pspdfkit/`,
          theme: document.documentElement.classList.contains('dark')
            ? PSPDFKit.Theme.DARK
            : PSPDFKit.Theme.LIGHT,
          toolbarItems: [
            { type: "sidebar-thumbnails" },
            { type: "sidebar-document-outline" },
            { type: "sidebar-annotations" },
            { type: "text-highlighter" },
          ],
        });

        if (disposed) {
          localInstance.dispose();
        } else {
          setInstance(localInstance);
          onReady?.(localInstance);
        }
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Unknown PSPDFKit error'));
      }
    };

    loadPdf();

    // Cleanup
    return () => {
      disposed = true;
      if (localInstance) localInstance.dispose();
    };
  }, [file, url, sdkReady, onReady, onError]);

  return { containerRef, instance, sdkError };
};
