

# Aikido Security Vulnerability Remediation Plan

This is a large set of findings. I'll categorize them by what we can actually fix in the codebase vs. what requires dependency upgrades vs. what are false positives/accepted risks.

---

## Category 1: Code-Level Fixes (We Can Fix Directly)

### 1.1 Path Traversal in fileService.ts (HIGH)
**Files:** `src/hooks/file-manager/fileService.ts`, `src/services/fileService.ts`
Both file services construct storage paths using user-supplied filenames without sanitizing path traversal characters (`../`).

**Fix:** Sanitize filenames by stripping path separators and `..` sequences before constructing the storage path. Add a `sanitizeFilename()` utility.

### 1.2 XSS via `window.location.href` in PaymentGate.tsx (HIGH)
**File:** `src/components/payment/PaymentGate.tsx`
`data.url` from the edge function is assigned directly to `window.location.href` without validating the URL scheme, enabling open redirect/XSS if the edge function is compromised.

**Fix:** Validate that `data.url` starts with `https://` before redirecting. Reject `javascript:`, `data:`, and other dangerous schemes.

### 1.3 `document.write` in PrintPreview.tsx (HIGH)
**File:** `src/components/document-viewer/viewers/text-editor/toolbar/PrintPreview.tsx`
Already partially fixed with DOMPurify, but `printWindow.document.write()` is still flagged. The content is sanitized, so this is low real risk, but we can switch to using a Blob URL approach to eliminate `document.write` entirely.

**Fix:** Replace `document.write` with a Blob-based approach: create an HTML blob, open it as a URL, then print.

### 1.4 `container.innerHTML = html` in pdfExport.ts (HIGH)
**File:** `src/components/document-viewer/viewers/text-editor/toolbar/file-operations/pdfExport.ts`
Raw HTML is set via `innerHTML` without sanitization.

**Fix:** Add `DOMPurify.sanitize(html)` before assigning to `innerHTML`.

### 1.5 SSRF in usePdfRenderer.ts and useScreenshot.ts (LOW)
**Files:** `src/components/document-viewer/viewers/pdf/usePdfRenderer.ts`, screenshot hook
URLs fetched without validation. 

**Fix:** Add URL validation to ensure only `https://` URLs from trusted domains (e.g., Supabase storage) are fetched.

### 1.6 Timing Attack on Password Comparison (HIGH — edge functions)
**Files:** Multiple `index.ts` edge functions
If any edge functions do string comparison for secrets/passwords, they should use constant-time comparison.

**Fix:** Audit edge functions and replace any `===` password/token comparisons with `crypto.timingSafeEqual()`.

---

## Category 2: Dependency Upgrades

These require bumping package versions. Some may have breaking changes.

| Package | Severity | Fix |
|---------|----------|-----|
| `mammoth` | Critical (path traversal) | Upgrade to latest |
| `jspdf` | High (code injection) | Already at 4.1.0, check for 4.2+ |
| `flatted` | High (prototype pollution) | Upgrade |
| `linkifyjs` | High (prototype pollution) | Upgrade |
| `pdfjs-dist` | High (DoS) | Upgrade from 3.4.120 to latest 3.x or 4.x |
| `react-pdf` | High (XSS) | Upgrade from 6.2.2 |
| `underscore` | High (DoS) | Remove if unused, or upgrade |
| `form-data` | Critical (weak randomness) | Upgrade |
| `glob` | High (OS command injection) | Upgrade |
| `dompurify` | Medium (XSS) | Upgrade from 3.3.1 to latest |
| `react-router-dom` | Medium (open redirect) | Upgrade |
| `lodash`/`lodash-es` | Medium (prototype pollution) | Upgrade |
| `nanoid` | Medium (DoS) | Upgrade |
| `react-hook-form` | Medium (prototype pollution) | Upgrade |
| Various low-severity | Low | Upgrade where possible |

**Approach:** Batch upgrade all dependencies to latest compatible versions. Test for breaking changes.

---

## Category 3: Accepted Risks / False Positives

### JWT in client.ts / extendedSupabaseClient.ts (HIGH/MEDIUM)
These are Supabase **anon keys** (publishable). They are designed to be public. This is a false positive — no action needed.

### JWT in supabase.ts (MEDIUM)
Same re-export of the anon key. False positive.

### "5 exposed secrets" in PasswordGate.tsx (MEDIUM)
PasswordGate.tsx contains no secrets — likely flagging the color hex codes or CSS values. False positive after inspection.

### "1 exposed secret" in ContactForm.tsx (MEDIUM)
No ContactForm.tsx exists in the codebase. May be a stale finding or from a deleted file. No action needed.

### `rollup` / `esbuild` / `eslint` / `browserslist` (build tools)
These are dev dependencies not shipped to production. Low/no real risk.

---

## Implementation Order

1. **Code fixes** (1.1–1.5) — direct security improvements, no breaking changes
2. **Dependency upgrades** — batch update `package.json`, test for regressions
3. **Edge function audit** — check timing attack vectors in auth-related functions

## Estimated Scope
- ~6 files modified for code fixes
- `package.json` update for dependency upgrades
- Edge function review (may require additional changes)

