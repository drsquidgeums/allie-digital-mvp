
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useMicroInteractions } from '@/hooks/useMicroInteractions';
import { useToast } from '@/hooks/use-toast';

interface EnhancedFileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onFileUpload,
  accept,
  disabled,
  className = ''
}) => {
  const { state, triggerInteraction, getStateClasses } = useMicroInteractions();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    await triggerInteraction(
      async () => {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        await onFileUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded`,
        });
        
        // Reset progress after success animation
        setTimeout(() => setUploadProgress(0), 1000);
      },
      {
        onError: (error) => {
          setUploadProgress(0);
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUploadZoneClasses = () => {
    let classes = `upload-zone border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${className}`;
    
    if (dragActive) {
      classes += ' upload-zone-active border-primary bg-primary/5';
    } else {
      classes += ' border-border hover:border-border/80 hover:bg-accent/50';
    }
    
    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    } else {
      classes += ' cursor-pointer';
    }
    
    classes += ` ${getStateClasses()}`;
    
    return classes;
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'processing':
        return <Upload className="h-6 w-6 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Upload className="h-6 w-6" />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'processing':
        return 'Uploading...';
      case 'success':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Click or drag file to upload';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={getUploadZoneClasses()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          <p className="text-sm font-medium">{getStatusText()}</p>
          {state === 'idle' && (
            <p className="text-xs text-muted-foreground">
              Supports various file formats
            </p>
          )}
        </div>
      </div>
      
      {state === 'processing' && uploadProgress > 0 && (
        <div className="space-y-2 upload-progress">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};
