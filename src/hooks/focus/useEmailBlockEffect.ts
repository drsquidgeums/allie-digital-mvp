
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useEmailBlockEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.blockEmails) return;

    console.log("Email notification blocking activated");
    
    // Store original notification permissions for email domains
    const emailDomains = [
      'mail.google.com',
      'outlook.office.com',
      'mail.yahoo.com',
      'outlook.live.com',
      'mail.proton.me'
    ];
    
    // Create a MutationObserver to detect and hide email notifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const el = node as HTMLElement;
              
              // Check if this is likely an email notification
              const isEmailNotification = 
                (el.classList.contains('notification') && 
                 (el.textContent?.includes('@') || 
                  el.textContent?.includes('email') || 
                  el.textContent?.includes('mail'))) ||
                (el.getAttribute('aria-label')?.includes('mail')) ||
                (emailDomains.some(domain => 
                  el.innerHTML.includes(domain) || 
                  el.getAttribute('src')?.includes(domain)));
              
              if (isEmailNotification) {
                el.style.display = 'none';
                console.log('Blocked email notification');
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      console.log("Email notification blocking deactivated");
      observer.disconnect();
    };
  }, [isActive, settings.blockEmails]);
};
