
import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Check if meta tags already exist to avoid duplicates
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      return;
    }

    // Content Security Policy - Balanced security with audio streaming support
    const csp = document.createElement('meta');
    csp.setAttribute('http-equiv', 'Content-Security-Policy');
    csp.setAttribute('content', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://fonts.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com; " +
      "font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com; " +
      "img-src 'self' data: blob: https: http:; " +
      "media-src *; " + // Allow all media sources for streaming
      "connect-src *; " + // Allow all connections for streaming APIs
      "frame-ancestors 'none';"
    );
    document.head.appendChild(csp);

    // X-Frame-Options
    const frameOptions = document.createElement('meta');
    frameOptions.setAttribute('http-equiv', 'X-Frame-Options');
    frameOptions.setAttribute('content', 'DENY');
    document.head.appendChild(frameOptions);

    // X-Content-Type-Options  
    const contentType = document.createElement('meta');
    contentType.setAttribute('http-equiv', 'X-Content-Type-Options');
    contentType.setAttribute('content', 'nosniff');
    document.head.appendChild(contentType);

    // Referrer Policy
    const referrerPolicy = document.createElement('meta');
    referrerPolicy.setAttribute('name', 'referrer');
    referrerPolicy.setAttribute('content', 'strict-origin-when-cross-origin');
    document.head.appendChild(referrerPolicy);

    // Permissions Policy - Allow audio for streaming
    const permissionsPolicy = document.createElement('meta');
    permissionsPolicy.setAttribute('http-equiv', 'Permissions-Policy');
    permissionsPolicy.setAttribute('content', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
    );
    document.head.appendChild(permissionsPolicy);

    console.log('Security headers applied with audio streaming support');

    return () => {
      // Cleanup function - remove security headers if component unmounts
      const headers = [
        'meta[http-equiv="Content-Security-Policy"]',
        'meta[http-equiv="X-Frame-Options"]',
        'meta[http-equiv="X-Content-Type-Options"]',
        'meta[name="referrer"]',
        'meta[http-equiv="Permissions-Policy"]'
      ];

      headers.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      });
    };
  }, []);
};
