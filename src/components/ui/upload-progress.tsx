
import React from 'react';
import { Progress } from './progress';
import { CheckCircle, Upload, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  fileSize?: string;
  className?: string;
  onCancel?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status,
  fileSize,
  className,
  onCancel
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse text-blue-500" aria-hidden="true" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />;
      default:
        return <Upload className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `Uploading ${fileName}... ${progress}%`;
      case 'completed':
        return `Upload complete: ${fileName}`;
      case 'error':
        return `Upload failed: ${fileName}`;
      default:
        return `Preparing ${fileName}...`;
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition-all duration-300",
        status === 'completed' && "border-green-200 bg-green-50",
        status === 'error' && "border-red-200 bg-red-50",
        status === 'uploading' && "border-blue-200 bg-blue-50",
        className
      )}
      role="status"
      aria-live="polite"
      aria-describedby={`upload-status-${fileName.replace(/[^a-zA-Z0-9]/g, '')}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
              {fileName}
            </p>
            {onCancel && status === 'uploading' && (
              <Button
                onClick={onCancel}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={`Cancel upload of ${fileName}`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {fileSize && (
            <p className="text-xs text-gray-500 mb-2" aria-label={`File size: ${fileSize}`}>
              {fileSize}
            </p>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span 
                id={`upload-status-${fileName.replace(/[^a-zA-Z0-9]/g, '')}`}
                className={cn(
                  "transition-colors duration-200",
                  status === 'completed' && "text-green-600",
                  status === 'error' && "text-red-600",
                  status === 'uploading' && "text-blue-600"
                )}
                aria-live="polite"
              >
                {getStatusText()}
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className={cn(
                "h-2 transition-all duration-300",
                status === 'error' && "opacity-50"
              )}
              aria-label={`Upload progress: ${progress}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
