
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderPlus, FolderOpen, File, MoreHorizontal } from 'lucide-react';
import { ManagedFile } from '@/hooks/file-manager/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface FileOrganizerProps {
  files: ManagedFile[];
  onCreateFolder: (name: string) => void;
  onMoveToFolder: (fileIds: string[], folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  folders: FileFolder[];
  selectedFiles: Set<string>;
}

export interface FileFolder {
  id: string;
  name: string;
  created_at: string;
  file_count: number;
}

export const FileOrganizer: React.FC<FileOrganizerProps> = ({
  files,
  onCreateFolder,
  onMoveToFolder,
  onDeleteFolder,
  folders,
  selectedFiles
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
      toast({
        title: "Folder created",
        description: `"${newFolderName}" folder has been created`,
      });
    }
  };

  const handleMoveFiles = (folderId: string) => {
    if (selectedFiles.size > 0) {
      onMoveToFolder(Array.from(selectedFiles), folderId);
      toast({
        title: "Files moved",
        description: `${selectedFiles.size} file(s) moved to folder`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">File Organization</h3>
        <Button
          onClick={() => setIsCreatingFolder(true)}
          size="sm"
          variant="outline"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {isCreatingFolder && (
        <div className="flex gap-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }
            }}
            autoFocus
          />
          <Button onClick={handleCreateFolder} size="sm">
            Create
          </Button>
          <Button 
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName('');
            }} 
            size="sm" 
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
              selectedFolder === folder.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium truncate">{folder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {folder.file_count} file{folder.file_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleMoveFiles(folder.id)}
                    disabled={selectedFiles.size === 0}
                  >
                    Move Selected Files Here
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteFolder(folder.id)}
                    className="text-destructive"
                  >
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {selectedFiles.size > 0 && (
        <div className="border rounded-lg p-3 bg-accent/50">
          <p className="text-sm font-medium mb-2">
            {selectedFiles.size} file(s) selected
          </p>
          <div className="flex gap-2">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                onClick={() => handleMoveFiles(folder.id)}
                size="sm"
                variant="outline"
              >
                Move to {folder.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
