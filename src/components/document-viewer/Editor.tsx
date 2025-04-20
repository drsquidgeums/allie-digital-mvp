
import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import 'prosemirror-view/style/prosemirror.css';

// Extend the basic schema with list support
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
});

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Make sure we're both mounted and the editor doesn't already exist
    if (!editorRef.current || viewRef.current) return;

    console.log("Initializing ProseMirror editor");

    try {
      // Create initial document with some content
      const doc = mySchema.nodeFromJSON({
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: 'Start typing here...' }]
        }]
      });

      // Create the editor state with the document
      const state = EditorState.create({
        schema: mySchema,
        doc,
        plugins: [keymap(baseKeymap)]
      });

      // Create the editor view
      viewRef.current = new EditorView(editorRef.current, {
        state,
        dispatchTransaction(transaction) {
          const newState = viewRef.current?.state.apply(transaction);
          if (newState && viewRef.current) {
            viewRef.current.updateState(newState);
          }
        }
      });

      setIsEditorReady(true);
      console.log("ProseMirror editor initialized successfully");
    } catch (error) {
      console.error("Error initializing ProseMirror editor:", error);
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = undefined;
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-background border-2 border-input rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b border-input">
        <h3 className="text-sm font-medium">Text Editor</h3>
      </div>
      <div 
        ref={editorRef} 
        className="prose prose-sm max-w-none p-4 focus-within:outline-none flex-grow min-h-[300px]"
        role="textbox"
        aria-label="Document editor"
      />
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};
