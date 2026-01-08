import React, { useState, useEffect } from "react";
import { WelcomeHeader } from "../password-gate/WelcomeHeader";
import { PaymentGate } from "./PaymentGate";

const gatewayBackground = "/images/gateway-background.png";

interface PaymentRequiredGateProps {
  onPaymentComplete: () => void;
}

export const PaymentRequiredGate: React.FC<PaymentRequiredGateProps> = ({ onPaymentComplete }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [paidEmail, setPaidEmail] = useState<string | null>(null);

  const colors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
  ];

  // Check if user just paid and came back
  useEffect(() => {
    const storedPaidEmail = localStorage.getItem("paid_email");
    if (storedPaidEmail) {
      setPaidEmail(storedPaidEmail);
    }
  }, []);

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
      html.dark .payment-gate,
      html .payment-gate,
      .dark .payment-gate,
      .payment-gate {
        background-color: #ffffff !important;
        opacity: 1 !important;
        color: #000000 !important;
      }
      
      html.dark .payment-gate *,
      html .payment-gate *,
      .dark .payment-gate *,
      .payment-gate *,
      .payment-gate *:before,
      .payment-gate *:after {
        color: #000000 !important;
        background-color: transparent !important;
        border-color: #d1d5db !important;
      }
      
      html.dark .payment-gate input,
      html .payment-gate input,
      .dark .payment-gate input,
      .payment-gate input {
        background-color: white !important;
        color: #000000 !important;
        border-color: #d1d5db !important;
      }
      
       html.dark .payment-gate button[type="submit"],
       html .payment-gate button[type="submit"],
       .dark .payment-gate button[type="submit"],
       .payment-gate button[type="submit"] {
         background-color: #000000 !important;
         color: #ffffff !important;
         border-color: #000000 !important;
       }

       html.dark .payment-gate button[type="submit"]:hover,
       html .payment-gate button[type="submit"]:hover,
       .dark .payment-gate button[type="submit"]:hover,
       .payment-gate button[type="submit"]:hover {
         background-color: #1f1f1f !important;
         color: #ffffff !important;
       }
      
      html.dark .payment-gate h1,
      html.dark .payment-gate h2,
      html.dark .payment-gate h3,
      html.dark .payment-gate p,
      html.dark .payment-gate span,
      html.dark .payment-gate div,
      html.dark .payment-gate label,
      html .payment-gate h1,
      html .payment-gate h2,
      html .payment-gate h3,
      html .payment-gate p,
      html .payment-gate span,
      html .payment-gate div,
      html .payment-gate label,
      .dark .payment-gate h1,
      .dark .payment-gate h2,
      .dark .payment-gate h3,
      .dark .payment-gate p,
      .dark .payment-gate span,
      .dark .payment-gate div,
      .dark .payment-gate label,
      .payment-gate h1,
      .payment-gate h2,
      .payment-gate h3,
      .payment-gate p,
      .payment-gate span,
      .payment-gate div,
      .payment-gate label {
        color: #000000 !important;
        text-shadow: none !important;
      }
      
      html.dark .payment-gate .paid-notice,
      html .payment-gate .paid-notice,
      .dark .payment-gate .paid-notice,
      .payment-gate .paid-notice {
        background-color: #f0fdf4 !important;
        border-color: #22c55e !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleClearPaidEmail = () => {
    localStorage.removeItem("paid_email");
    setPaidEmail(null);
  };

  return (
    <div 
      className="payment-gate min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        opacity: imagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#ffffff',
        color: '#000000',
        filter: 'none',
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
      {/* Blue tint overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#3b82f6',
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <div 
        className="w-full max-w-xl space-y-8 p-8 relative z-10"
        style={{
          backgroundColor: 'transparent',
          color: '#000000',
        }}
      >
        <WelcomeHeader colors={colors} />
        
        {paidEmail ? (
          <div className="space-y-6 text-center">
            <div 
              className="paid-notice p-4 rounded-lg border-2"
              style={{ 
                backgroundColor: '#f0fdf4', 
                borderColor: '#22c55e' 
              }}
            >
              <p className="font-semibold" style={{ color: '#166534' }}>
                ✓ Payment received for {paidEmail}
              </p>
              <p className="text-sm mt-1" style={{ color: '#166534' }}>
                Please sign out and sign back in, or refresh the page to access the app.
              </p>
            </div>
            <button
              onClick={handleClearPaidEmail}
              className="text-sm underline transition-colors hover:opacity-70"
              style={{ color: '#6b7280' }}
            >
              Use a different email?
            </button>
          </div>
        ) : (
          <PaymentGate onPaymentComplete={onPaymentComplete} />
        )}
      </div>
      <footer 
        className="absolute bottom-4 text-sm z-10" 
        style={{ 
          color: '#666666',
        }}
      >
        © Allie Digital Ltd. All Rights Reserved {new Date().getFullYear()}
      </footer>
    </div>
  );
};
