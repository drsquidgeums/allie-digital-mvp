
import React from 'react';

declare module '@radix-ui/react-tooltip' {
  interface TooltipTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
  }
}

declare module '@radix-ui/react-popover' {
  interface PopoverTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
  }
}

declare module '@radix-ui/react-dialog' {
  interface DialogTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
  }
  
  interface DialogCloseProps {
    children: React.ReactNode;
    asChild?: boolean;
  }
  
  interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
  }
}

declare module '@radix-ui/react-select' {
  interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
  }
  
  interface SelectContentProps {
    children: React.ReactNode;
    className?: string;
  }
  
  interface SelectItemProps {
    children: React.ReactNode;
    className?: string;
    value: string;
  }

  interface SelectScrollUpButtonProps {
    children?: React.ReactNode;
    className?: string;
  }

  interface SelectScrollDownButtonProps {
    children?: React.ReactNode;
    className?: string;
  }
}

// Fix for Slider component
declare module '@/components/ui/slider' {
  interface SliderProps {
    children?: React.ReactNode;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number[];
    onValueChange?: (value: number[]) => void;
    "aria-label"?: string;
    "aria-labelledby"?: string;
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
    "aria-labelledby"?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
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

// Fix for DropdownMenu component
declare module '@/components/ui/dropdown-menu' {
  interface DropdownMenuTriggerProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
  
  interface DropdownMenuItemProps {
    children?: React.ReactNode;
    onSelect?: (event: Event) => void;
    onClick?: () => void;
    key?: string;
    className?: string;
  }
}

// Fix for Context Menu component
declare module '@/components/ui/context-menu' {
  interface ContextMenuSubTriggerProps {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
  }

  interface ContextMenuSubContentProps {
    children: React.ReactNode;
    className?: string;
  }

  interface ContextMenuItemProps {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
  }

  interface ContextMenuCheckboxItemProps {
    children: React.ReactNode;
    className?: string;
    checked?: boolean;
  }

  interface ContextMenuRadioItemProps {
    children: React.ReactNode;
    className?: string;
  }
}

// Fix for radix-ui checkbox
declare module '@radix-ui/react-checkbox' {
  interface CheckboxProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    id?: string;
    className?: string;
  }
}

// Fix for Separator component
declare module '@/components/ui/separator' {
  interface SeparatorProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
  }
}
