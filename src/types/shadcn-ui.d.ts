
// Fix for children property in shadcn/ui components
import React from 'react';

declare module '@radix-ui/react-tooltip' {
  interface TooltipTriggerProps {
    children?: React.ReactNode;
  }
}

declare module '@radix-ui/react-popover' {
  interface PopoverTriggerProps {
    children?: React.ReactNode;
  }
}

declare module '@radix-ui/react-dialog' {
  interface DialogTriggerProps {
    children?: React.ReactNode;
  }
  
  interface DialogCloseProps {
    children?: React.ReactNode;
  }
  
  interface DialogTitleProps {
    children?: React.ReactNode;
  }
}

declare module '@radix-ui/react-select' {
  interface SelectTriggerProps {
    children?: React.ReactNode;
  }
  
  interface SelectContentProps {
    children?: React.ReactNode;
  }
  
  interface SelectItemProps {
    children?: React.ReactNode;
  }
}

// Fix for Slider component
declare module '@/components/ui/slider' {
  interface SliderProps {
    className?: string;
  }
}

// Fix for ScrollArea component
declare module '@/components/ui/scroll-area' {
  interface ScrollAreaProps {
    children?: React.ReactNode;
  }
}
