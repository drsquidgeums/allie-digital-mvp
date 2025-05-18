
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import htmlDocx from 'html-docx-js/dist/html-docx';

interface DocumentEditorProps {
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  url,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  const [isReady, setIsReady] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Loading document...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none max-w-none',
      },
    },
  });

  // Simulate loading document content when URL changes
  useEffect(() => {
    if (!url) {
      editor?.commands.setContent('<p>Paste a document URL above to start editing.</p>');
      setIsReady(false);
      return;
    }
    
    // For MVP, just set placeholder content with the URL
    const content = `<h2>Document Editor</h2><p>Editing document loaded from: ${url}</p><p>Start typing to edit this document...</p>`;
    editor?.commands.setContent(content);
    setIsReady(true);
    
    if (onContentLoaded) {
      onContentLoaded(content, `Document from ${url}`);
    }
  }, [url, editor, onContentLoaded]);

  // Export editor content as .docx file
  const exportDocx = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const converted = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(converted);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto border rounded p-4 bg-background">
        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
      {isReady && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={exportDocx}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            aria-label="Export document as DOCX"
          >
            Export as .docx
          </button>
        </div>
      )}
    </div>
  );
};
