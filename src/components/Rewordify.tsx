
import React, { useState } from "react";
import { Text } from "lucide-react";

export const Rewordify = () => {
  const [enabled, setEnabled] = useState(false);

  const simplifyText = () => {
    const documentViewer = document.querySelector('[role="document"]');
    if (!documentViewer) return;

    // Get the text content
    const textElements = documentViewer.querySelectorAll('p, span, div');
    
    // Simple word replacements (this is a basic example - could be expanded)
    const simplifications: { [key: string]: string } = {
      "therefore": "so",
      "however": "but",
      "nevertheless": "still",
      "approximately": "about",
      "sufficient": "enough",
      "require": "need",
      "utilize": "use",
      "implement": "use",
      "facilitate": "help",
      "terminate": "end",
    };

    textElements.forEach((element) => {
      if (enabled) {
        // Restore original text if it was saved
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
          element.textContent = originalText;
        }
      } else {
        // Save original text
        const originalText = element.textContent;
        if (originalText) {
          element.setAttribute('data-original-text', originalText);
          
          // Replace complex words with simpler ones
          let simplifiedText = originalText;
          Object.entries(simplifications).forEach(([complex, simple]) => {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            simplifiedText = simplifiedText.replace(regex, simple);
          });
          
          element.textContent = simplifiedText;
        }
      }
    });

    setEnabled(!enabled);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Text className="w-4 h-4" />
        <h3 className="font-medium">Rewordify</h3>
      </div>
      <button
        onClick={simplifyText}
        className="w-full px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        {enabled ? "Restore Original" : "Simplify Text"}
      </button>
    </div>
  );
};
