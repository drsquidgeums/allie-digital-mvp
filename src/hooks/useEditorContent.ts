
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { htmlToPlainText } from '@/components/document-viewer/viewers/text-editor/textFormatUtils';

export type EditorContentType = {
  html: string;
  text: string;
  editor: Editor | null;
}

// Global state to share editor content across components
let currentEditorContent: EditorContentType = {
  html: '',
  text: '',
  editor: null
};

let listeners: Array<(content: EditorContentType) => void> = [];

// Update the content and notify listeners
const updateEditorContent = (newContent: Partial<EditorContentType>) => {
  currentEditorContent = { ...currentEditorContent, ...newContent };
  
  // If HTML is updated but text isn't, extract text from HTML
  if (newContent.html && !newContent.text) {
    currentEditorContent.text = htmlToPlainText(newContent.html);
  }
  
  // Notify all listeners
  listeners.forEach(listener => listener(currentEditorContent));
};

/**
 * Hook to provide access to the current editor content across components
 */
export const useEditorContent = () => {
  const [editorContent, setEditorContent] = useState<EditorContentType>(currentEditorContent);

  useEffect(() => {
    // Add this component as a listener
    const listener = (content: EditorContentType) => {
      setEditorContent({ ...content });
    };
    
    listeners.push(listener);
    
    // Initial update if content exists
    if (currentEditorContent.html || currentEditorContent.editor) {
      listener(currentEditorContent);
    }
    
    // Remove listener on cleanup
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  /**
   * Update editor content - can be called by any component
   */
  const updateContent = (newContent: Partial<EditorContentType>) => {
    updateEditorContent(newContent);
  };

  /**
   * Get the current text content
   */
  const getTextContent = (): string => {
    return editorContent.text;
  };

  /**
   * Set new text in the editor (if editor is available)
   */
  const setEditorText = (text: string) => {
    if (editorContent.editor) {
      const html = `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
      editorContent.editor.commands.setContent(html);
      updateEditorContent({ html, text });
    }
  };

  /**
   * Get selected text from editor
   */
  const getSelectedText = (): string => {
    if (!editorContent.editor) return '';
    
    const { state } = editorContent.editor;
    const { from, to } = state.selection;
    
    if (from === to) return ''; // No selection
    
    return state.doc.textBetween(from, to, ' ');
  };

  return {
    content: editorContent,
    updateContent,
    getTextContent,
    setEditorText,
    getSelectedText,
  };
};

// Initialize with the current editor
export const initializeEditor = (editor: Editor | null) => {
  if (editor) {
    updateEditorContent({ 
      editor,
      html: editor.getHTML(),
      text: htmlToPlainText(editor.getHTML())
    });
  }
};

