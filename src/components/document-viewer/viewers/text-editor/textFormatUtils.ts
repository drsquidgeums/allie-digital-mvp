
/**
 * Converts plain text to HTML preserving line breaks
 */
export const plainTextToHtml = (text: string): string => {
  if (!text) return '';
  
  // Escape HTML special characters
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Replace line breaks with <br> tags
  return `<div>${escaped.replace(/\n/g, '<br>')}</div>`;
};

/**
 * Extracts plain text from HTML content
 */
export const htmlToPlainText = (html: string): string => {
  if (!html) return '';
  
  // Use DOM parser to extract text content
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/**
 * Detects if the content is HTML
 */
export const isHtml = (content: string): boolean => {
  return /<\/?[a-z][\s\S]*>/i.test(content);
};

/**
 * Formats content for the editor based on its type
 */
export const formatContentForEditor = (content: string): string => {
  if (!content) return '';
  
  return isHtml(content) ? content : plainTextToHtml(content);
};

/**
 * Sanitizes HTML content (basic implementation)
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // This is a very basic sanitization - for production you'd want a more robust solution
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/on\w+=\w+/g, '');
};
