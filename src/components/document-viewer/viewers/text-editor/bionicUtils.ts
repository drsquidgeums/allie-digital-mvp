
import { Editor } from '@tiptap/react';

/**
 * Applies bionic reading formatting to text by bolding the first portion of each word
 */
export const processBionicText = (text: string): string => {
  if (!text) return '';
  
  return text.split(/(\s+)/).map(word => {
    // Skip whitespace
    if (/^\s+$/.test(word)) return word;
    
    // Skip if word is too short
    if (word.length <= 1) return `<strong>${word}</strong>`;
    
    // Calculate how many characters to bold (roughly first half)
    const boldLength = Math.ceil(word.length / 2);
    const boldPart = word.slice(0, boldLength);
    const normalPart = word.slice(boldLength);
    
    return `<strong>${boldPart}</strong>${normalPart}`;
  }).join('');
};

/**
 * Applies bionic reading effect to the editor content
 */
export const applyBionicFormatting = (editor: Editor): string => {
  // Get current HTML content before transformation
  const originalHTML = editor.getHTML();
  
  // Get text content
  const textContent = editor.getText();
  
  if (!textContent.trim()) return originalHTML;
  
  // Process the text with bionic formatting
  const bionicHTML = processBionicText(textContent);
  
  // Set the new content
  editor.commands.setContent(`<p>${bionicHTML}</p>`);
  
  return originalHTML;
};

/**
 * Removes bionic formatting by restoring original content
 */
export const removeBionicFormatting = (editor: Editor, originalContent: string): void => {
  if (originalContent) {
    editor.commands.setContent(originalContent);
  }
};
