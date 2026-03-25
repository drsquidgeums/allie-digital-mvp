
/**
 * Sanitizes a filename to prevent path traversal attacks.
 * Strips directory separators, ".." sequences, and null bytes.
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove path traversal sequences
    .replace(/\.\./g, '')
    // Remove directory separators
    .replace(/[/\\]/g, '')
    // Remove leading dots (hidden files)
    .replace(/^\.+/, '')
    // Collapse multiple underscores/spaces
    .replace(/_{2,}/g, '_')
    .trim();
};

/**
 * Validates that a URL uses a safe scheme (https only).
 * Returns true if the URL is safe to redirect to.
 */
export const isSafeRedirectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates that a URL is from a trusted domain for fetching.
 * Only allows HTTPS URLs from Supabase storage or known safe origins.
 */
export const isTrustedFetchUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    // Allow Supabase storage URLs
    if (parsed.hostname.endsWith('.supabase.co')) return true;
    if (parsed.hostname.endsWith('.supabase.in')) return true;
    // Allow data URLs (used internally for screenshots)
    return false;
  } catch {
    return false;
  }
};
