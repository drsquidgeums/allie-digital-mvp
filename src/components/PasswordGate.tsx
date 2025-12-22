
import React, { useState, useEffect } from "react";
import { WelcomeHeader } from "./password-gate/WelcomeHeader";
import { AuthForm } from "./password-gate/AuthForm";

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

    bgImage.src = '/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png';
    logoImage.src = '/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png';
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
      
      html.dark .password-gate input,
      html .password-gate input,
      .dark .password-gate input,
      .password-gate input {
        background-color: white !important;
        color: #000000 !important;
        border-color: #d1d5db !important;
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

       html.dark .password-gate button[type="button"],
       html .password-gate button[type="button"],
       .dark .password-gate button[type="button"],
       .password-gate button[type="button"] {
         background-color: transparent !important;
         border: none !important;
         padding: 0 !important;
         box-shadow: none !important;
       }

       html.dark .password-gate button[type="button"]:hover,
       html .password-gate button[type="button"]:hover,
       .dark .password-gate button[type="button"]:hover,
       .password-gate button[type="button"]:hover {
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
      className="password-gate min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        opacity: imagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#ffffff !important',
        color: '#000000',
        // Force complete isolation from theme system
        filter: 'none',
      }}
    >
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
        className="absolute bottom-4 text-sm z-10" 
        style={{ 
          color: '#666666',
        }}
      >
        © Allie Digital Ltd. All Rights Reserved 2025
      </footer>
    </div>
  );
};
