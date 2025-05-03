
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
  // Re-export all the React exports
  export * from 'react';
  
  // Fix specific types that are causing issues
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

  // Add Component type
  export class Component<P = {}, S = {}> {
    constructor(props: P, context?: any);
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: any;
    };
  }

  // Explicitly specify the missing exports
  export const useState: <S>(initialState: S | (() => S)) => [S, (state: S | ((prev: S) => S)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: ReadonlyArray<any>) => void;
  export const useLayoutEffect: (effect: () => void | (() => void), deps?: ReadonlyArray<any>) => void;
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>) => T;
  export const useMemo: <T>(factory: () => T, deps: ReadonlyArray<any>) => T;
  export const lazy: <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) => T;
  export const Suspense: React.FC<{ fallback: React.ReactNode }>;
  export const memo: <P extends object>(Component: React.FunctionComponent<P>, propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean) => React.FunctionComponent<P>;
}
