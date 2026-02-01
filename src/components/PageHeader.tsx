import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Consistent page header component for all pages
 * Ensures uniform title positioning and spacing
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  children 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
