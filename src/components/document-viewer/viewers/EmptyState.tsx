
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * EmptyState Component
 * 
 * Displays a message when no document is loaded.
 * Provides a visual indicator and instructions for the user.
 */
export const EmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 space-y-4"
      role="status"
      aria-label="No document loaded"
    >
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">{t('document.emptyState')}</h3>
        <p className="text-sm">{t('document.emptyStateDescription')}</p>
      </div>
    </div>
  );
};
