
import { useEffect } from 'react';

/**
 * Security headers hook - minimal version.
 * 
 * Most security headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
 * only work as server-sent HTTP headers and cannot be set via meta tags.
 * CSP and referrer policy are now defined statically in index.html.
 * 
 * This hook is retained for compatibility but no longer injects meta tags.
 * Server-side headers should be configured via Lovable's hosting infrastructure.
 */
export const useSecurityHeaders = () => {
  useEffect(() => {
    console.log('Security headers: CSP and referrer policy defined in index.html. Server-side headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy) must be configured at the hosting level.');
  }, []);
};
