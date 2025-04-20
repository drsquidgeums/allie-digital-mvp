
import React, { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

// Extend the basic schema with list support
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
});

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    // Create the editor state
    const state = EditorState.create({
      schema: mySchema,
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

    return () => {
      viewRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full bg-background">
      <div 
        ref={editorRef} 
        className="prose prose-sm max-w-none h-full p-4 focus-within:outline-none"
        role="textbox"
        aria-label="Document editor"
      />
    </div>
  );
};
