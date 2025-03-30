
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
  Sticker,
  FileText, 
  PenTool
} from "lucide-react";

export const SHAPE_CONFIGS = {
  shapes: [
    { id: 'square', icon: Square, label: 'Square', description: 'Add a square node' },
    { id: 'circle', icon: CircleDot, label: 'Circle', description: 'Add a circular node' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', description: 'Add a triangular node' },
    { id: 'diamond', icon: Diamond, label: 'Diamond', description: 'Add a diamond node' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon', description: 'Add a hexagonal node' },
    { id: 'star', icon: Star, label: 'Star', description: 'Add a star node' },
  ],
  tools: [
    { id: 'text', icon: Type, label: 'Text', description: 'Add a text node' },
    { id: 'sticky', icon: FileText, label: 'Sticky Note', description: 'Add a sticky note' },
    { id: 'drawing', icon: PenTool, label: 'Drawing', description: 'Create a drawing' },
    { id: 'image', icon: Image, label: 'Image', description: 'Add an image' },
  ]
};
