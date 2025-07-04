
import React from 'react';
import { ManagedFile } from '@/hooks/file-manager/types';
import { FileText, Clock, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes, getDisplayName } from '@/utils/fileUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentFilesProps {
  recentFiles: ManagedFile[];
  onFileSelect: (file: ManagedFile) => void;
  onOpenInWorkspace: (file: ManagedFile) => void;
}

export const RecentFiles: React.FC<RecentFilesProps> = ({
  recentFiles,
  onFileSelect,
  onOpenInWorkspace
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      const days = Math.floor(diffDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (recentFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent files</p>
            <p className="text-sm">Upload some files to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentFiles.slice(0, 5).map((file) => {
            const displayName = file.displayName || getDisplayName(file.name);
            const cleanDisplayName = displayName.match(/^\d/) ? 'My File' : displayName;

            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate" title={cleanDisplayName}>
                      {cleanDisplayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.lastModified)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileSelect(file)}
                    className="h-8 px-2"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenInWorkspace(file)}
                    className="h-8 px-2"
                  >
                    <FolderOpen className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
