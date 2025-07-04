
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, FolderOpen, Download, CheckSquare, Square } from 'lucide-react';
import { ManagedFile } from '@/hooks/file-manager/types';
import { FileFolder } from './FileOrganizer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BulkActionsProps {
  selectedFiles: Set<string>;
  files: ManagedFile[];
  folders: FileFolder[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: (fileIds: string[]) => void;
  onBulkMove: (fileIds: string[], folderId: string) => void;
  onBulkDownload: (fileIds: string[]) => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedFiles,
  files,
  folders,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkMove,
  onBulkDownload
}) => {
  const allSelected = files.length > 0 && selectedFiles.size === files.length;
  const someSelected = selectedFiles.size > 0;

  return (
    <div className="flex items-center justify-between p-3 border-b bg-accent/20">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="h-8 w-8 p-0"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {someSelected ? (
            <>
              {selectedFiles.size} of {files.length} selected
            </>
          ) : (
            'Select files for bulk actions'
          )}
        </span>
      </div>

      {someSelected && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkDownload(Array.from(selectedFiles))}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {folders.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Move to
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => onBulkMove(Array.from(selectedFiles), folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDeselectAll}>
                Deselect All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onBulkDelete(Array.from(selectedFiles))}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
