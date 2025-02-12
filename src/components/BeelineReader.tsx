
import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export const BeelineReader = () => {
  const [enabled, setEnabled] = useState(false);

  const applyBeelineEffect = () => {
    // Target the document viewer
    const documentViewer = document.querySelector('[role="document"]');
    if (!documentViewer) return;

    // Get the iframe if it exists
    const iframe = documentViewer.querySelector('iframe');
    
    // If there's an iframe, we need to create an overlay
    if (iframe) {
      const existingOverlay = documentViewer.querySelector('.beeline-overlay');
      if (enabled && existingOverlay) {
        existingOverlay.remove();
      } else if (!enabled) {
        const overlay = document.createElement('div');
        overlay.className = 'beeline-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.background = 'linear-gradient(90deg, rgba(64, 64, 255, 0.2) 0%, rgba(128, 128, 255, 0.2) 33%, rgba(255, 64, 64, 0.2) 66%, rgba(255, 128, 128, 0.2) 100%)';
        overlay.style.zIndex = '9999';
        
        // Make sure the container is positioned relatively
        const container = iframe.parentElement;
        if (container) {
          container.style.position = 'relative';
          container.appendChild(overlay);
        }
      }
    } else {
      // Handle direct content as before
      const textElements = documentViewer.querySelectorAll(`
        p, span, div:not([class*="flex"]):not([class*="grid"]), 
        [class*="docs-"], 
        [class*="kix-"], 
        [id*="docs-"], 
        [id*="kix-"],
        .TextViewer *
      `);

      textElements.forEach((element) => {
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
          if (
            element.textContent?.trim() && 
            (!element.children.length || element.tagName.toLowerCase() === 'span')
          ) {
            element.classList.add('beeline-gradient');
          }
        }
      });
    }
    
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
