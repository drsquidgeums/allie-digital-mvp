
// Helper function to convert between different position formats
export const convertPosition = (position: any): any => {
  // Ensure the position has all required properties
  if (position.boundingRect) {
    // Add x1, y1, x2, y2 if they don't exist but left, top, right, bottom do
    if (!position.boundingRect.x1 && position.boundingRect.left !== undefined) {
      position.boundingRect.x1 = position.boundingRect.left;
      position.boundingRect.y1 = position.boundingRect.top;
      position.boundingRect.x2 = position.boundingRect.right;
      position.boundingRect.y2 = position.boundingRect.bottom;
    }
    
    // Add left, top, right, bottom if they don't exist but x1, y1, x2, y2 do
    if (!position.boundingRect.left && position.boundingRect.x1 !== undefined) {
      position.boundingRect.left = position.boundingRect.x1;
      position.boundingRect.top = position.boundingRect.y1;
      position.boundingRect.right = position.boundingRect.x2;
      position.boundingRect.bottom = position.boundingRect.y2;
    }
    
    // Add width and height if missing
    if (!position.boundingRect.width) {
      position.boundingRect.width = 
        position.boundingRect.right - position.boundingRect.left;
    }
    if (!position.boundingRect.height) {
      position.boundingRect.height = 
        position.boundingRect.bottom - position.boundingRect.top;
    }
  }
  
  // Handle rects array similarly
  if (position.rects && Array.isArray(position.rects)) {
    position.rects = position.rects.map((rect: any) => {
      // Copy x1, y1, x2, y2 to left, top, right, bottom if needed
      if (!rect.left && rect.x1 !== undefined) {
        rect.left = rect.x1;
        rect.top = rect.y1;
        rect.right = rect.x2;
        rect.bottom = rect.y2;
      }
      
      // Copy left, top, right, bottom to x1, y1, x2, y2 if needed
      if (!rect.x1 && rect.left !== undefined) {
        rect.x1 = rect.left;
        rect.y1 = rect.top;
        rect.x2 = rect.right;
        rect.y2 = rect.bottom;
      }
      
      // Add width and height if missing
      if (!rect.width) {
        rect.width = rect.right - rect.left;
      }
      if (!rect.height) {
        rect.height = rect.bottom - rect.top;
      }
      
      return rect;
    });
  }
  
  return position;
};

// Helper function to determine text color based on background luminance
export function getLuminance(hexColor: string): number {
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
