
import React, { useState, useEffect } from 'react';

interface WatermarkOverlayProps {
  text?: string;
  opacity?: number;
  isEnabled?: boolean;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  text = "CONFIDENTIAL - DO NOT CAPTURE",
  opacity = 0.15,
  isEnabled = true
}) => {
  const [userDetails, setUserDetails] = useState<string>("");
  
  useEffect(() => {
    // Get user info from NDA agreement if available
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsed = JSON.parse(ndaAgreement);
        setUserDetails(`${parsed.name} | ${parsed.email}`);
      } catch (error) {
        console.error("Error parsing NDA info:", error);
      }
    }
  }, []);

  if (!isEnabled) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="transform rotate-[-30deg] whitespace-nowrap" 
          style={{ opacity }}
        >
          <div className="flex flex-col gap-10 items-center">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex gap-20">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-2xl font-bold text-black dark:text-white">
                    {text}
                    {userDetails && <div className="text-sm mt-1">{userDetails}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
