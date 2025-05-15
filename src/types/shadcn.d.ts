
/**
 * Type declarations for shadcn UI components to fix compatibility issues
 * with Radix UI primitive components.
 */

declare module '@radix-ui/react-accordion' {
  interface AccordionItemProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AccordionTriggerProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AccordionContentProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<React.ComponentProps<'div'>>;
  const Item: React.FC<AccordionItemProps>;
  const Header: React.FC<React.ComponentProps<'h3'>>;
  const Trigger: React.FC<AccordionTriggerProps>;
  const Content: React.FC<AccordionContentProps>;
}

declare module '@radix-ui/react-alert-dialog' {
  interface AlertDialogOverlayProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AlertDialogContentProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AlertDialogTitleProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AlertDialogDescriptionProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AlertDialogActionProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AlertDialogCancelProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<React.ComponentProps<'div'>>;
  const Trigger: React.FC<React.ComponentProps<'button'> & { asChild?: boolean }>;
  const Portal: React.FC<React.ComponentProps<'div'>>;
  const Overlay: React.FC<AlertDialogOverlayProps>;
  const Content: React.FC<AlertDialogContentProps>;
  const Title: React.FC<AlertDialogTitleProps>;
  const Description: React.FC<AlertDialogDescriptionProps>;
  const Action: React.FC<AlertDialogActionProps>;
  const Cancel: React.FC<AlertDialogCancelProps>;
}

declare module '@radix-ui/react-avatar' {
  interface AvatarProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AvatarImageProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface AvatarFallbackProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<AvatarProps>;
  const Image: React.FC<AvatarImageProps>;
  const Fallback: React.FC<AvatarFallbackProps>;
}

declare module '@radix-ui/react-checkbox' {
  interface CheckboxProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<CheckboxProps>;
  const Indicator: React.FC<React.ComponentProps<'span'>>;
}

declare module '@radix-ui/react-dialog' {
  export interface DialogProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface DialogContentProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface DialogHeaderProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface DialogFooterProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface DialogTitleProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface DialogDescriptionProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<DialogProps>;
  const Trigger: React.FC<React.ComponentProps<'button'> & { asChild?: boolean }>;
  const Portal: React.FC<React.ComponentProps<'div'>>;
  const Overlay: React.FC<React.ComponentProps<'div'>>;
  const Content: React.FC<DialogContentProps>;
  const Header: React.FC<DialogHeaderProps>;
  const Footer: React.FC<DialogFooterProps>;
  const Title: React.FC<DialogTitleProps>;
  const Description: React.FC<DialogDescriptionProps>;
  const Close: React.FC<React.ComponentProps<'button'> & { asChild?: boolean }>;
}

declare module '@radix-ui/react-command' {
  interface CommandProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandInputProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandListProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandEmptyProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandGroupProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandItemProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandShortcutProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
  
  interface CommandSeparatorProps {
    [key: string]: any;
    children?: React.ReactNode;
  }
}

declare module '@radix-ui/react-collapsible' {
  const Root: React.FC<React.ComponentProps<'div'>>;
  const CollapsibleTrigger: React.FC<React.ComponentProps<'button'>>;
  const CollapsibleContent: React.FC<React.ComponentProps<'div'>>;
}

declare module '@radix-ui/react-context-menu' {
  interface ContextMenuProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuTriggerProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuContentProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuItemProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuSubProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuSubTriggerProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuSubContentProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuCheckboxItemProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuRadioItemProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuLabelProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  interface ContextMenuSeparatorProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  const Root: React.FC<ContextMenuProps>;
  const Trigger: React.FC<ContextMenuTriggerProps>;
  const Group: React.FC<React.ComponentProps<'div'>>;
  const Portal: React.FC<React.ComponentProps<'div'>>;
  const Sub: React.FC<ContextMenuSubProps>;
  const SubTrigger: React.FC<ContextMenuSubTriggerProps>;
  const SubContent: React.FC<ContextMenuSubContentProps>;
  const Content: React.FC<ContextMenuContentProps>;
  const Item: React.FC<ContextMenuItemProps>;
  const CheckboxItem: React.FC<ContextMenuCheckboxItemProps>;
  const RadioGroup: React.FC<React.ComponentProps<'div'>>;
  const RadioItem: React.FC<ContextMenuRadioItemProps>;
  const ItemIndicator: React.FC<React.ComponentProps<'span'>>;
  const Label: React.FC<ContextMenuLabelProps>;
  const Separator: React.FC<ContextMenuSeparatorProps>;
}

declare module '@radix-ui/react-aspect-ratio' {
  const Root: React.FC<React.ComponentProps<'div'>>;
}

declare module 'recharts' {
  interface LegendProps {
    [key: string]: any;
  }

  const BarChart: React.FC<any>;
  const Bar: React.FC<any>;
  const XAxis: React.FC<any>;
  const YAxis: React.FC<any>;
  const CartesianGrid: React.FC<any>;
  const Tooltip: React.FC<any>;
  const ResponsiveContainer: React.FC<any>;
  const Legend: React.FC<LegendProps>;
}
