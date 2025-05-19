
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  ListOrdered, 
  List, 
  Image,
  FileUp,
  FileDown,
  Highlighter,
  Link,
  Undo,
  Redo
} from 'lucide-react';
import { extractTextFromFile } from '../../FileConverter';

interface EditorToolbarProps {
  editor: Editor | null;
  selectedColor: string;
  onFileImport: (content: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  selectedColor,
  onFileImport
}) => {
  if (!editor) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await extractTextFromFile(file);
      onFileImport(content);
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleMark('underline').run()}
        className="h-8 w-8 p-0"
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8 p-0"
        aria-label="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="h-8 w-8 p-0"
        aria-label="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            // Check if text is selected
            if (editor.state.selection.empty) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        className="h-8 w-8 p-0"
        aria-label="Insert Link"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        style={{ color: selectedColor }}
        onClick={() => editor.chain().focus().setHighlight({ color: selectedColor }).run()}
        className="h-8 w-8 p-0"
        aria-label="Highlight Text"
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <div>
        <input
          type="file"
          id="file-upload"
          accept=".txt,.doc,.docx,.pdf,.html"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="h-8 w-8 p-0"
          aria-label="Import Document"
        >
          <FileUp className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const content = editor.getHTML();
          const blob = new Blob([content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.html';
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="h-8 w-8 p-0"
        aria-label="Export Document"
      >
        <FileDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
