
// Utility function to convert highlight positions between formats
export function convertPosition(position: any): any {
  if (!position) return position;
  
  // Create a deep copy to avoid mutating the original object
  const convertedPosition = JSON.parse(JSON.stringify(position));
  
  // Add necessary properties to boundingRect
  if (convertedPosition.boundingRect) {
    convertedPosition.boundingRect = {
      ...convertedPosition.boundingRect,
      left: convertedPosition.boundingRect.left || convertedPosition.boundingRect.x1,
      top: convertedPosition.boundingRect.top || convertedPosition.boundingRect.y1,
      right: convertedPosition.boundingRect.right || convertedPosition.boundingRect.x2,
      bottom: convertedPosition.boundingRect.bottom || convertedPosition.boundingRect.y2,
      width: convertedPosition.boundingRect.width || 
        (convertedPosition.boundingRect.x2 - convertedPosition.boundingRect.x1),
      height: convertedPosition.boundingRect.height || 
        (convertedPosition.boundingRect.y2 - convertedPosition.boundingRect.y1),
    };
  }
  
  // Process each rect in the rects array
  if (convertedPosition.rects && Array.isArray(convertedPosition.rects)) {
    convertedPosition.rects = convertedPosition.rects.map((rect: any) => ({
      ...rect,
      left: rect.left || rect.x1,
      top: rect.top || rect.y1,
      right: rect.right || rect.x2,
      bottom: rect.bottom || rect.y2,
      width: rect.width || (rect.x2 - rect.x1),
      height: rect.height || (rect.y2 - rect.y1),
    }));
  }
  
  return convertedPosition;
}

// Ensure comment is in the proper format for react-pdf-highlighter
export function formatComment(comment: string | { text: string; emoji?: string }): { text: string; emoji: string } {
  if (typeof comment === 'string') {
    return { text: comment, emoji: '💬' };
  }
  return { text: comment.text, emoji: comment.emoji || '💬' };
}

// Check if a highlight is valid
export function isValidHighlight(highlight: any): boolean {
  return (
    highlight &&
    highlight.id &&
    highlight.position &&
    highlight.position.boundingRect &&
    Array.isArray(highlight.position.rects)
  );
}
