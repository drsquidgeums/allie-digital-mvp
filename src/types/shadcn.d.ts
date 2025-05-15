
/**
 * Type declarations for shadcn UI components to fix compatibility issues
 * with Radix UI primitive components.
 */

declare module '@radix-ui/react-accordion' {
  interface AccordionItemProps {
    [key: string]: any;
  }
  
  interface AccordionTriggerProps {
    [key: string]: any;
  }
  
  interface AccordionContentProps {
    [key: string]: any;
  }
}

declare module '@radix-ui/react-alert-dialog' {
  interface AlertDialogOverlayProps {
    [key: string]: any;
  }
  
  interface AlertDialogContentProps {
    [key: string]: any;
  }
  
  interface AlertDialogTitleProps {
    [key: string]: any;
  }
  
  interface AlertDialogDescriptionProps {
    [key: string]: any;
  }
  
  interface AlertDialogActionProps {
    [key: string]: any;
  }
  
  interface AlertDialogCancelProps {
    [key: string]: any;
  }
}

declare module '@radix-ui/react-avatar' {
  interface AvatarProps {
    [key: string]: any;
  }
  
  interface AvatarImageProps {
    [key: string]: any;
  }
  
  interface AvatarFallbackProps {
    [key: string]: any;
  }
}

declare module '@radix-ui/react-checkbox' {
  interface CheckboxProps {
    [key: string]: any;
  }
}

declare module 'recharts' {
  interface LegendProps {
    [key: string]: any;
  }
}

declare module '@radix-ui/react-command' {
  interface CommandProps {
    [key: string]: any;
  }
  
  interface CommandInputProps {
    [key: string]: any;
  }
  
  interface CommandListProps {
    [key: string]: any;
  }
  
  interface CommandEmptyProps {
    [key: string]: any;
  }
  
  interface CommandGroupProps {
    [key: string]: any;
  }
  
  interface CommandItemProps {
    [key: string]: any;
  }
  
  interface CommandShortcutProps {
    [key: string]: any;
  }
  
  interface CommandSeparatorProps {
    [key: string]: any;
  }
}
