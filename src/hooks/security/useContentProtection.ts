import { useCallback } from 'react';

export const useContentProtection = () => {
  const applyWatermark = useCallback(() => {
    // Check if watermark already exists
    if (document.querySelector('.security-watermark')) {
      return;
    }

    const sessionId = sessionStorage.getItem('security_session_id') || 'ANON';
    const timestamp = new Date().toLocaleString();
    
    const watermark = document.createElement('div');
    watermark.className = 'security-watermark';
    watermark.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      font-size: 8px;
      color: rgba(128, 128, 128, 0.3);
      pointer-events: none;
      z-index: 9999;
      font-family: monospace;
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 4px;
      border-radius: 2px;
      user-select: none;
    `;
    watermark.textContent = `${sessionId.slice(-8)} • ${timestamp}`;
    
    document.body.appendChild(watermark);
    
    // Remove after 30 seconds to prevent accumulation
    setTimeout(() => {
      if (watermark && watermark.parentNode) {
        watermark.parentNode.removeChild(watermark);
      }
    }, 30000);
  }, []);

  const monitorClipboard = useCallback(() => {
    if (!navigator.clipboard) return;

    // Monitor clipboard write operations
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = function(text: string) {
      console.log('Clipboard write detected:', text.length, 'characters');
      
      // Log clipboard activity
      const event = new CustomEvent('securityActivity', {
        detail: { 
          type: 'clipboard_write', 
          length: text.length,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);
      
      return originalWriteText.call(this, text);
    };

    // Monitor clipboard read operations
    const originalReadText = navigator.clipboard.readText;
    navigator.clipboard.readText = function() {
      console.log('Clipboard read detected');
      
      const event = new CustomEvent('securityActivity', {
        detail: { 
          type: 'clipboard_read',
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);
      
      return originalReadText.call(this);
    };
  }, []);

  const trackDownloads = useCallback((filename: string, fileType: string, fileSize?: number) => {
    const downloadEvent = {
      type: 'file_download',
      filename,
      fileType,
      fileSize,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('security_session_id'),
      userAgent: navigator.userAgent
    };

    // Store download log
    const downloads = JSON.parse(localStorage.getItem('security_downloads') || '[]');
    downloads.push(downloadEvent);
    
    // Keep only last 100 downloads
    if (downloads.length > 100) {
      downloads.splice(0, downloads.length - 100);
    }
    
    localStorage.setItem('security_downloads', JSON.stringify(downloads));
    
    console.log('Download tracked:', downloadEvent);
  }, []);

  const preventPrint = useCallback((enable: boolean = true) => {
    if (enable) {
      // Override print function
      window.print = function() {
        console.log('Print attempt blocked');
        const event = new CustomEvent('securityActivity', {
          detail: { 
            type: 'print_blocked',
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(event);
      };

      // Block Ctrl+P and Cmd+P
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
          e.preventDefault();
          console.log('Print shortcut blocked');
        }
      });
    }
  }, []);

  const addDocumentWatermark = useCallback((content: string) => {
    const sessionId = sessionStorage.getItem('security_session_id') || 'ANON';
    const watermarkText = `\n\n--- Document accessed via session ${sessionId.slice(-8)} on ${new Date().toLocaleString()} ---`;
    return content + watermarkText;
  }, []);

  return {
    applyWatermark,
    monitorClipboard,
    trackDownloads,
    preventPrint,
    addDocumentWatermark
  };
};
