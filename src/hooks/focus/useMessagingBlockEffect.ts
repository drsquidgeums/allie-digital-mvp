
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useMessagingBlockEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.blockMessaging) return;

    console.log("Messaging app blocking activated");
    
    // Common messaging app domains
    const messagingDomains = [
      'web.whatsapp.com',
      'web.telegram.org',
      'discord.com',
      'slack.com',
      'messenger.com',
      'teams.microsoft.com'
    ];
    
    // Block messaging notifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const el = node as HTMLElement;
              
              // Check if this is likely a messaging notification
              const isMessagingNotification = 
                (el.classList.contains('notification') && 
                 (el.textContent?.includes('message') || 
                  el.textContent?.includes('chat'))) ||
                (messagingDomains.some(domain => 
                  el.innerHTML.includes(domain) || 
                  el.getAttribute('src')?.includes(domain)));
              
              if (isMessagingNotification) {
                el.style.display = 'none';
                console.log('Blocked messaging notification');
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      console.log("Messaging app blocking deactivated");
      observer.disconnect();
    };
  }, [isActive, settings.blockMessaging]);
};
