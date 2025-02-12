
import React, { useState } from "react";
import { TextSelect } from "lucide-react";

export const BeelineReader = () => {
  const [enabled, setEnabled] = useState(false);

  const applyBeelineEffect = () => {
    const textElements = document.querySelectorAll('p, span, div');
    textElements.forEach((element, index) => {
      if (enabled) {
        element.classList.remove('beeline-gradient');
      } else {
        if (element.textContent?.trim()) {
          element.classList.add('beeline-gradient');
        }
      }
    });
    setEnabled(!enabled);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TextSelect className="w-4 h-4" />
        <h3 className="font-medium">Beeline Reader</h3>
      </div>
      <button
        onClick={applyBeelineEffect}
        className="w-full px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        {enabled ? "Disable" : "Enable"} Beeline Effect
      </button>
      <style>{`
        .beeline-gradient {
          background: linear-gradient(
            90deg,
            rgba(70, 70, 70, 0.1) 0%,
            rgba(70, 70, 70, 0.3) 50%,
            rgba(70, 70, 70, 0.1) 100%
          );
          background-size: 200% 100%;
          background-position: 0 0;
          animation: gradient 2s linear infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
