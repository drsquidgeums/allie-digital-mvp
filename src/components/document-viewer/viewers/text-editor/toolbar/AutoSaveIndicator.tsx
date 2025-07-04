
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Badge } from '@/components/ui/badge';
import { Save, Check, Clock } from 'lucide-react';

interface AutoSaveIndicatorProps {
  editor: Editor;
  documentTitle: string;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUpdate = () => {
      setSaveStatus('unsaved');
      
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Auto-save after 2 seconds of inactivity
      timeoutId = setTimeout(() => {
        setSaveStatus('saving');
        
        // Simulate save process
        setTimeout(() => {
          const content = editor.getHTML();
          const timestamp = new Date().toISOString();
          
          // Save to localStorage as a simple implementation
          const savedData = {
            title: documentTitle,
            content,
            timestamp
          };
          
          localStorage.setItem(`autosave_${documentTitle}`, JSON.stringify(savedData));
          
          setSaveStatus('saved');
          setLastSaved(new Date());
        }, 500);
      }, 2000);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [editor, documentTitle]);

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saved':
        return <Check className="h-3 w-3 text-green-600" />;
      case 'saving':
        return <Save className="h-3 w-3 animate-pulse" />;
      case 'unsaved':
        return <Clock className="h-3 w-3 text-orange-500" />;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saved':
        return `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      case 'saving':
        return 'Saving...';
      case 'unsaved':
        return 'Unsaved changes';
    }
  };

  const getStatusVariant = () => {
    switch (saveStatus) {
      case 'saved':
        return 'default' as const;
      case 'saving':
        return 'secondary' as const;
      case 'unsaved':
        return 'destructive' as const;
    }
  };

  return (
    <Badge 
      variant={getStatusVariant()} 
      className="gap-1 text-xs"
      aria-label={`Auto-save status: ${getStatusText()}`}
    >
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  );
};
