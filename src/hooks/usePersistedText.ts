
import { useState, useEffect } from "react";

/**
 * Hook to persist text input for specific tools across sessions
 * @param toolId Unique identifier for the tool (e.g., "bionic", "tts", "rewordify")
 * @param initialText Optional default text to use if no saved text exists
 * @returns [text, setText] tuple similar to useState
 */
export const usePersistedText = (toolId: string, initialText: string = "") => {
  // Create a storage key specific to this tool
  const storageKey = `tool-text-${toolId}`;

  // Initialize state with saved text or initial value
  const [text, setTextInternal] = useState<string>(() => {
    try {
      // Try to get saved text from localStorage
      const savedText = localStorage.getItem(storageKey);
      return savedText !== null ? savedText : initialText;
    } catch (error) {
      // Fallback to initial text if localStorage fails
      console.error("Error accessing localStorage:", error);
      return initialText;
    }
  });

  // Custom setText function that updates both state and localStorage
  const setText = (newText: string | ((prevText: string) => string)) => {
    setTextInternal((prevText) => {
      // Handle both direct value and function updater
      const updatedText = typeof newText === "function" ? newText(prevText) : newText;
      
      // Save to localStorage
      try {
        localStorage.setItem(storageKey, updatedText);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      return updatedText;
    });
  };

  return [text, setText] as const;
};
