
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

  const Root: React.FC<React.ComponentProps<'div'>>;
  const Item: React.FC<AccordionItemProps>;
  const Header: React.FC<React.ComponentProps<'h3'>>;
  const Trigger: React.FC<AccordionTriggerProps>;
  const Content: React.FC<AccordionContentProps>;
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

  const Root: React.FC<React.ComponentProps<'div'>>;
  const Trigger: React.FC<React.ComponentProps<'button'>>;
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
    [key: string]: any;
  }
  
  interface AvatarImageProps {
    [key: string]: any;
  }
  
  interface AvatarFallbackProps {
    [key: string]: any;
  }

  const Root: React.FC<AvatarProps>;
  const Image: React.FC<AvatarImageProps>;
  const Fallback: React.FC<AvatarFallbackProps>;
}

declare module '@radix-ui/react-checkbox' {
  interface CheckboxProps {
    [key: string]: any;
  }

  const Root: React.FC<CheckboxProps>;
  const Indicator: React.FC<React.ComponentProps<'span'>>;
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

declare module '@radix-ui/react-collapsible' {
  const Root: React.FC<React.ComponentProps<'div'>>;
  const CollapsibleTrigger: React.FC<React.ComponentProps<'button'>>;
  const CollapsibleContent: React.FC<React.ComponentProps<'div'>>;
}

declare module '@radix-ui/react-context-menu' {
  const Root: React.FC;
  const Trigger: React.FC;
  const Group: React.FC;
  const Portal: React.FC;
  const Sub: React.FC;
  const RadioGroup: React.FC;
}

declare module '@radix-ui/react-dialog' {
  const Root: React.FC;
  const Trigger: React.FC;
  const Portal: React.FC;
  const Overlay: React.FC;
  const Content: React.FC;
  const Title: React.FC;
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
  const Legend: React.FC<any>;
}

declare module '@radix-ui/react-aspect-ratio' {
  const Root: React.FC<React.ComponentProps<'div'>>;
}
