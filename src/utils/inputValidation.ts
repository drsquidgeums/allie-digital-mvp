
import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address").max(254);
export const nameSchema = z.string().min(1, "Name is required").max(100).regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in name");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

// Text content validation (prevents XSS)
export const textContentSchema = z.string().max(10000, "Text too long").refine(
  (text) => !containsScriptTags(text),
  "Invalid content detected"
);

// Comment validation for feedback
export const commentSchema = z.string().max(2000, "Comment too long").refine(
  (text) => !containsScriptTags(text),
  "Invalid content detected"
);

// Task text validation
export const taskTextSchema = z.string().min(1, "Task text is required").max(500, "Task text too long").refine(
  (text) => !containsScriptTags(text),
  "Invalid content detected"
);

// URL validation
export const urlSchema = z.string().url("Invalid URL").max(2048, "URL too long");

// Helper function to detect potential XSS
function containsScriptTags(text: string): boolean {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(text));
}

// Sanitize HTML content
export function sanitizeHtml(input: string): string {
  // Remove all HTML tags except safe ones
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br'];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  
  return input.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
