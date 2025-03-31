
import { ColorOption } from '../types';

export const colorOptions: ColorOption[] = [
  { value: 'hsl(var(--primary))', label: 'Primary' },
  { value: 'hsl(var(--secondary))', label: 'Secondary' },
  { value: 'hsl(var(--accent))', label: 'Accent' },
  { value: 'hsl(var(--muted))', label: 'Shape Color' },
  { value: 'custom', label: 'Custom' },
];

export const textColorOptions: ColorOption[] = [
  { value: 'auto', label: 'Text' },
  { value: 'hsl(var(--foreground))', label: 'Default Text' },
  { value: 'hsl(var(--primary))', label: 'Primary Text' },
  { value: 'hsl(var(--secondary))', label: 'Secondary Text' },
  { value: 'custom', label: 'Custom Text' },
];
