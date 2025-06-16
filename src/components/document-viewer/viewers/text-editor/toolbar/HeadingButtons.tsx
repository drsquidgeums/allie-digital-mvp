
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heading } from 'lucide-react';

interface HeadingButtonsProps {
  editor: Editor;
}

const headingLevels = [
  { label: 'Normal Text', level: 0 },
  { label: 'Heading 1', level: 1 },
  { label: 'Heading 2', level: 2 },
  { label: 'Heading 3', level: 3 },
  { label: 'Heading 4', level: 4 },
  { label: 'Heading 5', level: 5 },
  { label: 'Heading 6', level: 6 },
];

export const HeadingButtons: React.FC<HeadingButtonsProps> = ({ editor }) => {
  const setHeading = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Headings"
        >
          <Heading className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {headingLevels.map((heading) => (
          <DropdownMenuItem
            key={heading.level}
            onClick={() => setHeading(heading.level)}
            className={`${
              heading.level === 1 ? 'text-2xl font-bold' :
              heading.level === 2 ? 'text-xl font-bold' :
              heading.level === 3 ? 'text-lg font-bold' :
              heading.level === 4 ? 'text-base font-bold' :
              heading.level === 5 ? 'text-sm font-bold' :
              heading.level === 6 ? 'text-xs font-bold' :
              'text-sm'
            }`}
          >
            {heading.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
