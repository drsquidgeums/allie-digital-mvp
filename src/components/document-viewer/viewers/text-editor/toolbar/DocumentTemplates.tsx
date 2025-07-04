
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileImage, GraduationCap, Briefcase, Heart, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplatesProps {
  editor: Editor;
}

interface Template {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  content: string;
}

const templates: Template[] = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    icon: Users,
    category: 'Business',
    content: `
      <h1>Meeting Notes</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Attendees:</strong> </p>
      <p><strong>Agenda:</strong></p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <h2>Discussion Points</h2>
      <p></p>
      <h2>Action Items</h2>
      <ul>
        <li><strong>Task:</strong> [Assignee] - [Due Date]</li>
      </ul>
      <h2>Next Steps</h2>
      <p></p>
    `
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    icon: Briefcase,
    category: 'Business',
    content: `
      <h1>Project Proposal</h1>
      <p><strong>Project Title:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Prepared by:</strong> </p>
      
      <h2>Executive Summary</h2>
      <p>Brief overview of the project...</p>
      
      <h2>Project Objectives</h2>
      <ul>
        <li>Objective 1</li>
        <li>Objective 2</li>
        <li>Objective 3</li>
      </ul>
      
      <h2>Scope of Work</h2>
      <p>Detailed description of project scope...</p>
      
      <h2>Timeline</h2>
      <p>Project timeline and milestones...</p>
      
      <h2>Budget</h2>
      <p>Cost breakdown and budget requirements...</p>
      
      <h2>Conclusion</h2>
      <p>Summary and next steps...</p>
    `
  },
  {
    id: 'essay-outline',
    name: 'Essay Outline',
    icon: GraduationCap,
    category: 'Academic',
    content: `
      <h1>Essay Title</h1>
      <p><strong>Subject:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>I. Introduction</h2>
      <ul>
        <li>Hook: </li>
        <li>Background information: </li>
        <li>Thesis statement: </li>
      </ul>
      
      <h2>II. Body Paragraph 1</h2>
      <ul>
        <li>Topic sentence: </li>
        <li>Supporting evidence: </li>
        <li>Analysis: </li>
        <li>Transition: </li>
      </ul>
      
      <h2>III. Body Paragraph 2</h2>
      <ul>
        <li>Topic sentence: </li>
        <li>Supporting evidence: </li>
        <li>Analysis: </li>
        <li>Transition: </li>
      </ul>
      
      <h2>IV. Body Paragraph 3</h2>
      <ul>
        <li>Topic sentence: </li>
        <li>Supporting evidence: </li>
        <li>Analysis: </li>
        <li>Transition: </li>
      </ul>
      
      <h2>V. Conclusion</h2>
      <ul>
        <li>Restate thesis: </li>
        <li>Summarize main points: </li>
        <li>Final thought: </li>
      </ul>
    `
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    icon: Heart,
    category: 'Personal',
    content: `
      <h1>Daily Journal Entry</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>Today's Highlights</h2>
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      
      <h2>Mood & Feelings</h2>
      <p>How I'm feeling today...</p>
      
      <h2>Gratitude</h2>
      <p>Three things I'm grateful for:</p>
      <ol>
        <li></li>
        <li></li>
        <li></li>
      </ol>
      
      <h2>Lessons Learned</h2>
      <p>What I learned today...</p>
      
      <h2>Tomorrow's Goals</h2>
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    `
  },
  {
    id: 'letter-formal',
    name: 'Formal Letter',
    icon: FileText,
    category: 'Communication',
    content: `
      <p style="text-align: right;">[Your Address]<br>
      [City, State ZIP Code]<br>
      [Email Address]<br>
      [Phone Number]<br>
      ${new Date().toLocaleDateString()}</p>
      
      <p>[Recipient's Name]<br>
      [Title]<br>
      [Company/Organization]<br>
      [Address]<br>
      [City, State ZIP Code]</p>
      
      <p>Dear [Recipient's Name],</p>
      
      <p>I am writing to...</p>
      
      <p>[Body paragraph 1 - State your purpose]</p>
      
      <p>[Body paragraph 2 - Provide details/explanation]</p>
      
      <p>[Body paragraph 3 - Call to action or next steps]</p>
      
      <p>Thank you for your time and consideration. I look forward to your response.</p>
      
      <p>Sincerely,<br>
      [Your Name]<br>
      [Your Title]</p>
    `
  },
  {
    id: 'blank-document',
    name: 'Blank Document',
    icon: FileImage,
    category: 'General',
    content: `
      <h1>Untitled Document</h1>
      <p>Start writing here...</p>
    `
  }
];

export const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({ editor }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const applyTemplate = (template: Template) => {
    if (editor) {
      editor.commands.setContent(template.content);
      toast({
        title: "Template Applied",
        description: `${template.name} template has been loaded`,
      });
      setIsOpen(false);
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          aria-label="Document Templates"
        >
          <FileText className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates], categoryIndex) => (
          <div key={category}>
            {categoryIndex > 0 && <DropdownMenuSeparator />}
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              {category}
            </div>
            {categoryTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="cursor-pointer"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {template.name}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
