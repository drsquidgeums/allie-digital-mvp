
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: []
  });
};

// Validation schemas
export const emailSchema = z.string().email().max(254);
export const nameSchema = z.string().min(1).max(100).regex(/^[a-zA-Z\s\-'\.]+$/);
export const textSchema = z.string().min(1).max(10000);
export const taskTextSchema = z.string().min(1).max(500);
export const commentSchema = z.string().max(5000);

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count += 1;
  return true;
};

// Input length validation
export const validateInputLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};

// XSS detection patterns
const xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
];

export const detectXSS = (input: string): boolean => {
  return xssPatterns.some(pattern => pattern.test(input));
};
