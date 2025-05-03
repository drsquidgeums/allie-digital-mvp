
/// <reference types="vite/client" />

// React module declarations
declare module 'react' {
  export default React;
  export = React;
}

// React DOM module declarations
declare module 'react-dom' {
  export default ReactDOM;
  export = ReactDOM;
}

// React Router DOM module declarations
declare module 'react-router-dom' {
  export * from 'react-router-dom';
}

// Lucide React declarations
declare module 'lucide-react' {
  export * from 'lucide-react';
}

// React Color declarations
declare module 'react-color' {
  export * from 'react-color';
}

// React Hook Form declarations
declare module 'react-hook-form' {
  export * from 'react-hook-form';
}

// React i18next declarations
declare module 'react-i18next' {
  export * from 'react-i18next';
}

// For SVGs
declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

// For CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// For CSS
declare module '*.css' {
  const css: string;
  export default css;
}

// For images
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

// For AI Assistant component
interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
}
