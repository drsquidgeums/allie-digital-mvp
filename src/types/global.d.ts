
// Global type definitions
import React from 'react';

declare global {
  // Add global type definitions here if needed

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix for React types
declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export type KeyboardEvent<T = Element> = React.SyntheticEvent<T> & {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  };
  
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
  
  export interface ReactNodeArray extends Array<ReactNode> {}
  
  export type ErrorInfo = {
    componentStack: string;
  };
}

