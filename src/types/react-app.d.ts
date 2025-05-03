
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface HTMLAttributes<T> {
    // Add any missing HTML attributes that might be used
    tabIndex?: number;
  }
}

// For icon types
declare module 'lucide-react' {
  import React from 'react';
  
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = React.FC<LucideProps>;

  // Export all the icons used in the project
  export const Bot: LucideIcon;
  export const FileText: LucideIcon;
  export const Sparkles: LucideIcon;
  export const BookOpen: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Eye: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Focus: LucideIcon;
  export const Glasses: LucideIcon;
  export const Globe: LucideIcon;
  export const Bell: LucideIcon;
  export const X: LucideIcon;
  export const SpellCheck: LucideIcon;
  export const Mic: LucideIcon;
  export const MicOff: LucideIcon;
  export const Copy: LucideIcon;
  export const Play: LucideIcon;
  export const Pause: LucideIcon;
  export const Square: LucideIcon;
  export const Moon: LucideIcon;
  export const Sun: LucideIcon;
  export const Type: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Minimize2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Music: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const Repeat: LucideIcon;
  export const Send: LucideIcon;
  export const Paintbrush: LucideIcon;
  export const Highlighter: LucideIcon;
  export const Users: LucideIcon;
  export const HandshakeIcon: LucideIcon;
  export const Book: LucideIcon;
  export const Calendar: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Link: LucideIcon;
  export const Star: LucideIcon;
  export const Trophy: LucideIcon;
  export const Tag: LucideIcon;
  export const Check: LucideIcon;
  export const Trash2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ZoomIn: LucideIcon;
  export const ZoomOut: LucideIcon;
  export const RotateCw: LucideIcon;
  export const PenLine: LucideIcon;
  export const Keyboard: LucideIcon;
  export const Camera: LucideIcon;
  export const Timer: LucideIcon;
  export const Text: LucideIcon;
  export const StickyNote: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Hand: LucideIcon;
  export const MousePointer: LucideIcon;
  export const Plus: LucideIcon;
  export const Video: LucideIcon;
}

// For react-router-dom types
declare module 'react-router-dom' {
  import React from 'react';
  
  export interface BrowserRouterProps {
    children?: React.ReactNode;
  }
  
  export const BrowserRouter: React.FC<BrowserRouterProps>;
  
  export interface NavigateProps {
    to: string;
    replace?: boolean;
  }
  
  export const Navigate: React.FC<NavigateProps>;

  export interface RoutesProps {
    children?: React.ReactNode;
  }
  
  export const Routes: React.FC<RoutesProps>;

  export interface RouteProps {
    path: string;
    element: React.ReactNode;
  }
  
  export const Route: React.FC<RouteProps>;
}

// For react-color types
declare module 'react-color' {
  import React from 'react';
  
  export interface ChromePickerProps {
    color?: string;
    onChange?: (color: any) => void;
    onChangeComplete?: (color: any) => void;
    disableAlpha?: boolean;
    className?: string;
  }
  
  export const ChromePicker: React.FC<ChromePickerProps>;
}

// For react-hook-form types
declare module 'react-hook-form' {
  export function useForm(options?: any): {
    register: (name: string, options?: any) => any;
    handleSubmit: (onSubmit: (data: any) => void) => (e: React.FormEvent<HTMLFormElement>) => void;
    formState: {
      errors: Record<string, any>;
      isSubmitting: boolean;
    };
    reset: () => void;
  };
}

// For react-i18next types
declare module 'react-i18next' {
  export function useTranslation(namespace?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: {
      language: string;
      changeLanguage: (lang: string) => Promise<void>;
    };
  };
}

// For @tanstack/react-query types
declare module '@tanstack/react-query' {
  export class QueryClient {
    constructor(config?: any);
  }
  
  export interface QueryClientProviderProps {
    client: QueryClient;
    children?: React.ReactNode;
  }
  
  export const QueryClientProvider: React.FC<QueryClientProviderProps>;
  
  export interface UseQueryOptions {
    queryKey: any[];
    queryFn: () => any;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
  }

  export function useQuery(options: UseQueryOptions): {
    data: any;
    isLoading: boolean;
    error: Error | null;
  };
}
