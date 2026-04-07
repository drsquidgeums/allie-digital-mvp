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
    const allieLogo = new Image();
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === 3) {
        setImagesLoaded(true);
      }
    };

    bgImage.onload = handleImageLoad;
    logoImage.onload = handleImageLoad;
    allieLogo.onload = handleImageLoad;

    bgImage.src = gatewayBackground;
    logoImage.src = lovableLogo;
    allieLogo.src = "/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png";
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
        className="w-full max-w-xl space-y-4 p-8 relative z-10"
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
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© 2026 Allie Digital CIC · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
    </div>
  );
};
