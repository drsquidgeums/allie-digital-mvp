import { 
  CircleDot, 
  Square, 
  Triangle, 
  Diamond, 
  Hexagon, 
  Star, 
  Palette,
  Type,
  Image,
  Sticker
} from "lucide-react";

export const SHAPE_CONFIGS = {
  shapes: [
    { id: 'circle', icon: CircleDot, label: 'Circle Node', description: 'Add a circular node' },
    { id: 'square', icon: Square, label: 'Square Node', description: 'Add a square node' },
    { id: 'triangle', icon: Triangle, label: 'Triangle Node', description: 'Add a triangular node' },
    { id: 'diamond', icon: Diamond, label: 'Diamond Node', description: 'Add a diamond node' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon Node', description: 'Add a hexagonal node' },
    { id: 'star', icon: Star, label: 'Star Node', description: 'Add a star node' },
  ],
  tools: [
    { id: 'text', icon: Type, label: 'Text Node', description: 'Add a text node' },
    { id: 'image', icon: Image, label: 'Image Node', description: 'Add an image node' },
    { id: 'sticker', icon: Sticker, label: 'Sticker Node', description: 'Add a sticker node' },
    { id: 'custom', icon: Palette, label: 'Custom Node', description: 'Add a custom node' },
  ]
};