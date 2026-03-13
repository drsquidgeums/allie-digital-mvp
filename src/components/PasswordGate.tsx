import React, { useState, useEffect } from "react";
import { WelcomeHeader } from "./password-gate/WelcomeHeader";
import { AuthForm } from "./password-gate/AuthForm";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const colors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
  ];

  useEffect(() => {
    const bgImage = new Image();
    const logoImage = new Image();
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImagesLoaded(true);
      }
    };

    bgImage.onload = handleImageLoad;
    logoImage.onload = handleImageLoad;

    // Preload the actual imported images
    bgImage.src = gatewayBackground;
    logoImage.src = lovableLogo;
  }, []);

  // Inject CSS styles to override theme styles with maximum specificity
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html.dark .password-gate,
      html .password-gate,
      .dark .password-gate,
      .password-gate {
        background-color: #ffffff !important;
        opacity: 1 !important;
        color: #000000 !important;
      }
      
      html.dark .password-gate *,
      html .password-gate *,
      .dark .password-gate *,
      .password-gate *,
      .password-gate *:before,
      .password-gate *:after {
        color: #000000 !important;
        background-color: transparent !important;
        border-color: #d1d5db !important;
      }
      
      /* Allow SVG icons to have their own colors */
      html.dark .password-gate svg,
      html .password-gate svg,
      .dark .password-gate svg,
      .password-gate svg {
        color: inherit !important;
      }

      /* Discord link color override */
      html.dark .password-gate .discord-link,
      html .password-gate .discord-link,
      .dark .password-gate .discord-link,
      .password-gate .discord-link,
      html.dark .password-gate .discord-link svg,
      html .password-gate .discord-link svg,
      .dark .password-gate .discord-link svg,
      .password-gate .discord-link svg {
        color: #5865F2 !important;
      }
      
      html.dark .password-gate input,
      html .password-gate input,
      .dark .password-gate input,
      .password-gate input {
        background-color: white !important;
        color: #000000 !important;
        border-color: #d1d5db !important;
      }

      /* Radix/shadcn Checkbox (it's a button[role=checkbox]) */
      html.dark .password-gate button[role="checkbox"],
      html .password-gate button[role="checkbox"],
      .dark .password-gate button[role="checkbox"],
      .password-gate button[role="checkbox"] {
        background-color: #ffffff !important;
        border-color: #9ca3af !important;
        color: #000000 !important;
        opacity: 1 !important;
      }

      html.dark .password-gate button[role="checkbox"][data-state="checked"],
      html .password-gate button[role="checkbox"][data-state="checked"],
      .dark .password-gate button[role="checkbox"][data-state="checked"],
      .password-gate button[role="checkbox"][data-state="checked"] {
        background-color: #000000 !important;
        border-color: #000000 !important;
        color: #ffffff !important; /* makes the Check icon visible */
      }

       html.dark .password-gate button[type="submit"],
       html .password-gate button[type="submit"],
       .dark .password-gate button[type="submit"],
       .password-gate button[type="submit"] {
         background-color: #000000 !important;
         color: #ffffff !important;
         border-color: #000000 !important;
       }

       html.dark .password-gate button[type="submit"]:hover,
       html .password-gate button[type="submit"]:hover,
       .dark .password-gate button[type="submit"]:hover,
       .password-gate button[type="submit"]:hover {
         background-color: #1f1f1f !important;
         color: #ffffff !important;
       }

       html.dark .password-gate button[type="button"]:not([role="checkbox"]),
       html .password-gate button[type="button"]:not([role="checkbox"]),
       .dark .password-gate button[type="button"]:not([role="checkbox"]),
       .password-gate button[type="button"]:not([role="checkbox"]) {
         background-color: transparent !important;
         border: none !important;
         padding: 0 !important;
         box-shadow: none !important;
       }

       html.dark .password-gate button[type="button"]:not([role="checkbox"]):hover,
       html .password-gate button[type="button"]:not([role="checkbox"]):hover,
       .dark .password-gate button[type="button"]:not([role="checkbox"]):hover,
       .password-gate button[type="button"]:not([role="checkbox"]):hover {
         background-color: transparent !important;
       }
      
      html.dark .password-gate h1,
      html.dark .password-gate h2,
      html.dark .password-gate h3,
      html.dark .password-gate p,
      html.dark .password-gate span,
      html.dark .password-gate div,
      html.dark .password-gate label,
      html .password-gate h1,
      html .password-gate h2,
      html .password-gate h3,
      html .password-gate p,
      html .password-gate span,
      html .password-gate div,
      html .password-gate label,
      .dark .password-gate h1,
      .dark .password-gate h2,
      .dark .password-gate h3,
      .dark .password-gate p,
      .dark .password-gate span,
      .dark .password-gate div,
      .dark .password-gate label,
      .password-gate h1,
      .password-gate h2,
      .password-gate h3,
      .password-gate p,
      .password-gate span,
      .password-gate div,
      .password-gate label {
        color: #000000 !important;
        text-shadow: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div 
      className="password-gate min-h-screen flex flex-col items-center justify-between relative overflow-hidden py-8"
      style={{
        opacity: imagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#ffffff',
        color: '#000000',
        filter: 'none',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Background image - fixed position so it doesn't move */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${gatewayBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      
      {/* Spacer for top */}
      <div className="flex-shrink-0" />
      
      <div 
        className="w-full max-w-xl space-y-8 p-8 relative z-10"
        style={{
          backgroundColor: 'transparent',
          color: '#000000',
        }}
      >
        <WelcomeHeader colors={colors} />
        <AuthForm onAuthenticated={onAuthenticated} />
      </div>
      
      <footer 
        className="text-center z-10 flex-shrink-0 mt-4" 
        style={{ 
          color: '#666666',
        }}
      >
        <div className="mb-3">
          <img src="/images/open-source-logo.png" alt="Open Source" className="h-[75px] mx-auto" />
        </div>
        <div className="flex items-center justify-center mb-2 w-full">
          <a
            href="https://discord.com/invite/wAwjSyqY6a"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Discord server"
            className="discord-link hover:opacity-80 transition-opacity"
            style={{ color: '#5865F2' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
            </svg>
          </a>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© 2026 Allie Digital CIC · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
    </div>
  );
};
