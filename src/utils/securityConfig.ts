
// Security configuration constants
export const SECURITY_CONFIG = {
  // Rate limiting settings
  RATE_LIMITS: {
    AUTH_ATTEMPTS: { max: 5, windowMs: 300000 }, // 5 attempts per 5 minutes
    TASK_CREATION: { max: 10, windowMs: 60000 }, // 10 tasks per minute
    FEEDBACK_SUBMISSION: { max: 2, windowMs: 3600000 }, // 2 per hour
    CONTACT_FORM: { max: 3, windowMs: 600000 }, // 3 per 10 minutes
    RESOURCE_SHARING: { max: 5, windowMs: 300000 }, // 5 per 5 minutes
    NDA_SUBMISSION: { max: 3, windowMs: 300000 }, // 3 per 5 minutes
  },
  
  // Input validation limits
  INPUT_LIMITS: {
    NAME_MAX: 100,
    EMAIL_MAX: 254,
    TEXT_MAX: 10000,
    TASK_TEXT_MAX: 500,
    COMMENT_MAX: 5000,
    URL_MAX: 500,
    CHAT_INPUT_MAX: 1000,
  },
  
  // XSS Protection patterns
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*>/gi,
  ],
  
  // Content Security Policy settings
  CSP_SETTINGS: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https://api.openai.com", "https://frvjnuuqacrrrvrhzhuj.supabase.co"],
  },
  
  // Sensitive data patterns to detect and warn about
  SENSITIVE_PATTERNS: [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, // IP addresses
  ],
} as const;
