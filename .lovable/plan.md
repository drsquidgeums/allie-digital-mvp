

# Security Headers Remediation Plan

## Summary

Your app has duplicate, conflicting Content Security Policies and several security header meta tags that browsers ignore because they only work as server-sent HTTP headers. This plan consolidates everything into a single, tightened CSP in `index.html` and cleans up the ineffective JS-based headers.

---

## What Will Change

### 1. Consolidate CSP into `index.html` (single source of truth)

Update the existing CSP meta tag in `index.html` to add the missing `frame-ancestors 'none'` directive and remove `http:` from `img-src`. The final CSP will be:

- `default-src 'self'`
- `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.gpteng.co https://api.elevenlabs.io https://cdn.elevenlabs.io https://*.elevenlabs.io`
- `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.elevenlabs.io wss://api.elevenlabs.io https://*.elevenlabs.io https://fonts.googleapis.com https://fonts.cdnfonts.com`
- `worker-src 'self' blob:`
- `child-src 'self' blob:`
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com`
- `font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com data:`
- `img-src 'self' data: https: blob:` (removed `http:`)
- `media-src 'self' https: blob: data: https://ice1.somafm.com https://radio.stereoscenic.com https://media-ssl.musicradio.com`
- `frame-ancestors 'none'` (added -- prevents clickjacking)

### 2. Simplify `useSecurityHeaders.ts`

Remove the CSP, X-Frame-Options, X-Content-Type-Options, and Permissions-Policy meta tag injections since browsers ignore these as meta tags (they must be HTTP headers). Keep only the referrer policy meta tag, which browsers **do** respect when set via meta tag.

### 3. Add Referrer Policy to `index.html`

Move the referrer policy into `index.html` as a static meta tag for reliability:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

---

## Files to Modify

- **`index.html`** -- Update CSP, add referrer policy meta tag
- **`src/hooks/security/useSecurityHeaders.ts`** -- Strip down to minimal (or remove entirely since all effective headers will be in `index.html`)

---

## Technical Notes

- `X-Frame-Options`, `X-Content-Type-Options`, and `Permissions-Policy` only work as HTTP response headers set by the server. Lovable's hosting infrastructure controls these -- if the pentest flagged them, that would need to be raised with Lovable support.
- `unsafe-inline` and `unsafe-eval` in `script-src` are required by Vite/React's runtime. Removing them would break the app. This is a known trade-off.
- `frame-ancestors 'none'` in a meta tag CSP is actually ignored by browsers too (it only works as an HTTP header), but including it does no harm and documents intent. True clickjacking protection requires Lovable's server to send the header.

