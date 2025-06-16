
import { useEffect, useState } from 'react';

interface AccessibilityIssue {
  type: 'warning' | 'error';
  element: string;
  issue: string;
  suggestion: string;
}

export const useAccessibilityAudit = (enabled: boolean = false) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [auditComplete, setAuditComplete] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const runAccessibilityAudit = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for missing alt attributes on images
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img, index) => {
        foundIssues.push({
          type: 'error',
          element: `img[${index}]`,
          issue: 'Missing alt attribute',
          suggestion: 'Add descriptive alt text for screen readers'
        });
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach((button, index) => {
        if (!button.textContent?.trim()) {
          foundIssues.push({
            type: 'error',
            element: `button[${index}]`,
            issue: 'Button without accessible name',
            suggestion: 'Add aria-label or visible text content'
          });
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > lastLevel + 1) {
          foundIssues.push({
            type: 'warning',
            element: `${heading.tagName.toLowerCase()}[${index}]`,
            issue: 'Heading level skipped',
            suggestion: 'Use sequential heading levels for proper document structure'
          });
        }
        lastLevel = currentLevel;
      });

      // Check for interactive elements without focus indicators
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      interactiveElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element, ':focus');
        if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
          foundIssues.push({
            type: 'warning',
            element: `${element.tagName.toLowerCase()}[${index}]`,
            issue: 'Missing focus indicator',
            suggestion: 'Ensure interactive elements have visible focus indicators'
          });
        }
      });

      // Check for proper form labels
      const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
      inputs.forEach((input, index) => {
        const hasLabel = input.closest('label') || 
                        document.querySelector(`label[for="${input.id}"]`) ||
                        input.getAttribute('aria-label') ||
                        input.getAttribute('aria-labelledby');
        
        if (!hasLabel) {
          foundIssues.push({
            type: 'error',
            element: `${input.tagName.toLowerCase()}[${index}]`,
            issue: 'Form input without label',
            suggestion: 'Associate form inputs with descriptive labels'
          });
        }
      });

      setIssues(foundIssues);
      setAuditComplete(true);

      // Log summary
      if (foundIssues.length > 0) {
        console.group('🔍 Accessibility Audit Results');
        console.log(`Found ${foundIssues.length} accessibility issues:`);
        foundIssues.forEach(issue => {
          console.log(`${issue.type === 'error' ? '❌' : '⚠️'} ${issue.element}: ${issue.issue}`);
        });
        console.groupEnd();
      } else {
        console.log('✅ No accessibility issues found');
      }
    };

    // Delay audit to ensure DOM is fully rendered
    const timeoutId = setTimeout(runAccessibilityAudit, 1000);

    return () => clearTimeout(timeoutId);
  }, [enabled]);

  return {
    issues,
    auditComplete,
    errorCount: issues.filter(i => i.type === 'error').length,
    warningCount: issues.filter(i => i.type === 'warning').length
  };
};
