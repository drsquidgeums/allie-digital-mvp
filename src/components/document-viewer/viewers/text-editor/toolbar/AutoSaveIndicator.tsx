
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Save, Check, Loader2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  editor: Editor;
  documentTitle: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    let saveTimeout: NodeJS.Timeout;

    const handleUpdate = () => {
      setSaveStatus('unsaved');
      
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Auto-save after 2 seconds of inactivity
      saveTimeout = setTimeout(() => {
        setSaveStatus('saving');
        
        // Simulate save process
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSaved(new Date());
        }, 500);
      }, 2000);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [editor]);

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'saved':
        return <Check className="h-3 w-3 text-green-600" />;
      case 'unsaved':
        return <Save className="h-3 w-3 text-amber-600" />;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return `Saved ${lastSaved.toLocaleTimeString()}`;
      case 'unsaved':
        return 'Unsaved changes';
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 border-l">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};
