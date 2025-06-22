
import { useCallback } from 'react';
import { useContentProtection } from './useContentProtection';

export const useFileSecurityTracker = () => {
  const { trackDownloads, addDocumentWatermark } = useContentProtection();

  const trackFileUpload = useCallback((filename: string, fileSize: number, fileType: string) => {
    const uploadEvent = {
      type: 'file_upload',
      filename,
      fileSize,
      fileType,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('security_session_id')
    };

    // Store upload log
    const uploads = JSON.parse(localStorage.getItem('security_uploads') || '[]');
    uploads.push(uploadEvent);
    
    if (uploads.length > 100) {
      uploads.splice(0, uploads.length - 100);
    }
    
    localStorage.setItem('security_uploads', JSON.stringify(uploads));
    
    // Dispatch security activity event
    const event = new CustomEvent('securityActivity', {
      detail: uploadEvent
    });
    window.dispatchEvent(event);
  }, []);

  const trackFileView = useCallback((filename: string, fileType: string) => {
    const viewEvent = {
      type: 'file_view',
      filename,
      fileType,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('security_session_id')
    };

    const views = JSON.parse(localStorage.getItem('security_file_views') || '[]');
    views.push(viewEvent);
    
    if (views.length > 200) {
      views.splice(0, views.length - 200);
    }
    
    localStorage.setItem('security_file_views', JSON.stringify(views));
  }, []);

  const secureFileDownload = useCallback((filename: string, content: string, fileType: string) => {
    // Add watermark to content
    const watermarkedContent = addDocumentWatermark(content);
    
    // Track the download
    trackDownloads(filename, fileType, watermarkedContent.length);
    
    // Create and trigger download
    const blob = new Blob([watermarkedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [trackDownloads, addDocumentWatermark]);

  return {
    trackFileUpload,
    trackFileView,
    trackDownloads,
    secureFileDownload
  };
};
