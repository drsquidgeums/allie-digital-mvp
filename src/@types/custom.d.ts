
// This file provides type declarations for modules used in the project

// Define custom types for the project components
interface ExtendedHighlight {
  id: string;
  content: {
    text: string;
  };
  position?: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }>;
    pageNumber: number;
  };
  comment?: string;
  color?: string;
}

// Badge props need to include children
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children?: React.ReactNode;
}

// Props for specific components
interface FileItemProps {
  file: File;
  index: number;
  focusedIndex: number;
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  onFocus: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
}

interface ResourceCardProps {
  resource: any;
  onRate: (id: string) => void;
}

interface ColorOptionProps {
  name: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

interface IntegrationItemProps {
  title: string;
  description: string;
  isLoading: boolean;
  onClick: () => Promise<void>;
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

// Add any other needed props interfaces here
