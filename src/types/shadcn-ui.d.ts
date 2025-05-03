
// Fix for children property in shadcn/ui components
import React from 'react';

declare module '@radix-ui/react-tooltip' {
  interface TooltipTriggerProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
}

declare module '@radix-ui/react-popover' {
  interface PopoverTriggerProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
}

declare module '@radix-ui/react-dialog' {
  interface DialogTriggerProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
  
  interface DialogCloseProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
  
  interface DialogTitleProps {
    children?: React.ReactNode;
    className?: string;
  }
}

declare module '@radix-ui/react-select' {
  interface SelectTriggerProps {
    children?: React.ReactNode;
    className?: string;
  }
  
  interface SelectContentProps {
    children?: React.ReactNode;
    className?: string;
  }
  
  interface SelectItemProps {
    children?: React.ReactNode;
    className?: string;
  }
}

// Fix for Slider component
declare module '@/components/ui/slider' {
  interface SliderProps {
    className?: string;
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number[];
    onValueChange?: (value: number[]) => void;
    "aria-label"?: string;
  }
}

// Fix for ScrollArea component
declare module '@/components/ui/scroll-area' {
  interface ScrollAreaProps {
    children?: React.ReactNode;
    className?: string;
    role?: string;
    "aria-label"?: string;
  }
}

// Fix for Label component
declare module '@/components/ui/label' {
  interface LabelProps {
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
  }
}

// Fix for RadioGroup component
declare module '@/components/ui/radio-group' {
  interface RadioGroupProps {
    children?: React.ReactNode;
    className?: string;
    "aria-label"?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
  
  interface RadioGroupItemProps {
    id?: string;
    "aria-label"?: string;
    value: string;
  }
}

// Fix for Switch component
declare module '@/components/ui/switch' {
  interface SwitchProps {
    id?: string;
    "aria-label"?: string;
    checked?: boolean;
    onCheckedChange?: () => void;
  }
}

// Fix for ChromePicker from react-color
declare module 'react-color' {
  interface ChromePickerProps {
    className?: string;
    disableAlpha?: boolean;
  }
}

// Fix for Toggle component
declare module '@/components/ui/toggle' {
  interface ToggleProps {
    children?: React.ReactNode;
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    "aria-label"?: string;
    className?: string;
  }
}
