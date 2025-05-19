
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useToast } from '@/hooks/use-toast';
import { EditorToolbar } from './EditorToolbar';
import './editor.css';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  selectedColor: string;
  isReadOnly?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onContentChange,
  selectedColor,
  isReadOnly = false,
}) => {
  const { toast } = useToast();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'highlight',
        },
      }),
      Image,
      TextStyle,
      Color,
      Underline,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
    ],
    content: initialContent,
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onContentChange) {
        onContentChange(html);
      }
    },
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Apply selected highlight color
  useEffect(() => {
    if (editor && selectedColor) {
      editor.chain().focus().setColor(selectedColor).run();
    }
  }, [editor, selectedColor]);

  // Handle file import (document pasting)
  const handleFileImport = (content: string) => {
    if (editor) {
      editor.commands.setContent(content);
      toast({
        title: "Document Imported",
        description: "The document has been imported into the editor",
      });
    }
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden bg-card"
      data-testid="rich-text-editor"
    >
      {!isReadOnly && (
        <EditorToolbar 
          editor={editor} 
          selectedColor={selectedColor} 
          onFileImport={handleFileImport}
        />
      )}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[calc(100vh-200px)] shadow-sm rounded-lg p-6">
          <EditorContent 
            editor={editor} 
            className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
