
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

interface Window {
  webkitSpeechRecognition: any;
}

// Fix for ChromePicker from react-color
declare module 'react-color' {
  import { ComponentClass } from 'react';
  
  export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
    hsl: { h: number; s: number; l: number; a?: number };
  }
  
  export interface ColorPickerProps {
    color?: any;
    onChange?: (color: ColorResult) => void;
    onChangeComplete?: (color: ColorResult) => void;
    disableAlpha?: boolean;
    [key: string]: any;
  }
  
  export const ChromePicker: ComponentClass<ColorPickerProps>;
}

// Fix for Speech Recognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
}
