
// Global type definitions file

// File item props
interface FileItemProps {
  file: File;
  index: number;
  focusedIndex: number;
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  onFocus: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

// Define missing types for other components
interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
}

declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    forcedTheme?: string;
    themes?: string[];
    value?: { [x: string]: string };
    children?: React.ReactNode;
  }
  
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  
  export function useTheme(): {
    theme: string;
    setTheme: (theme: string) => void;
    themes: string[];
    systemTheme?: string;
  };
}

declare module '@tanstack/react-query' {
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
