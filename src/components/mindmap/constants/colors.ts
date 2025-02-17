
import { ColorOption } from '../types';

export const colorOptions: ColorOption[] = [
  { label: 'Default', value: 'hsl(var(--muted))' },
  { label: 'Purple', value: '#E5DEFF' },
  { label: 'Green', value: '#F2FCE2' },
  { label: 'Yellow', value: '#FEF7CD' },
  { label: 'Orange', value: '#FEC6A1' },
  { label: 'Pink', value: '#FFDEE2' },
  { label: 'Blue', value: '#D3E4FD' },
  { label: 'Custom', value: 'custom' },
];

export const textColorOptions: ColorOption[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Gray', value: '#666666' },
  { label: 'Custom', value: 'custom' },
];
