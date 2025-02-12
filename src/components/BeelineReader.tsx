
import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export const BeelineReader = () => {
  const [enabled, setEnabled] = useState(false);

  const applyBeelineEffect = () => {
    // Target the document viewer
    const documentViewer = document.querySelector('[role="document"]');
    if (!documentViewer) return;

    // Get all text-containing elements, including those from Google Docs
    const textElements = documentViewer.querySelectorAll(`
      p, span, div:not([class*="flex"]):not([class*="grid"]), 
      [class*="docs-"], 
      [class*="kix-"], 
      [id*="docs-"], 
      [id*="kix-"],
      .TextViewer *
    `);

    textElements.forEach((element) => {
      // Skip elements that are containers or have specific roles
      if (
        element.getAttribute('role') === 'toolbar' ||
        element.getAttribute('role') === 'button' ||
        element.classList.contains('toolbar') ||
        element.tagName.toLowerCase() === 'button'
      ) {
        return;
      }

      if (enabled) {
        element.classList.remove('beeline-gradient');
      } else {
        // Only apply to elements that contain direct text
        if (
          element.textContent?.trim() && 
          (!element.children.length || element.tagName.toLowerCase() === 'span')
        ) {
          element.classList.add('beeline-gradient');
        }
      }
    });
    setEnabled(!enabled);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
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
          color: transparent !important;
          background: linear-gradient(
            90deg,
            rgb(64, 64, 255) 0%,
            rgb(128, 128, 255) 33%,
            rgb(255, 64, 64) 66%,
            rgb(255, 128, 128) 100%
          ) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
