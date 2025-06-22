
import React from 'react';
import { Progress } from './progress';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        return <Upload className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `Uploading... ${progress}%`;
      case 'completed':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      default:
        return 'Preparing...';
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
    <div className={cn(
      "border rounded-lg p-4 transition-all duration-300",
      status === 'completed' && "border-green-200 bg-green-50",
      status === 'error' && "border-red-200 bg-red-50",
      status === 'uploading' && "border-blue-200 bg-blue-50",
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
            {onCancel && status === 'uploading' && (
              <button
                onClick={onCancel}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          
          {fileSize && (
            <p className="text-xs text-gray-500 mb-2">{fileSize}</p>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className={cn(
                "transition-colors duration-200",
                status === 'completed' && "text-green-600",
                status === 'error' && "text-red-600",
                status === 'uploading' && "text-blue-600"
              )}>
                {getStatusText()}
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className={cn(
                "h-2 transition-all duration-300",
                status === 'error' && "opacity-50"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
