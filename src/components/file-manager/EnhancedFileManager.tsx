
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2, Upload, FolderOpen, CheckSquare, Square, ArrowLeft, Folder } from 'lucide-react';
import { useFileManager } from '@/hooks/file-manager';
import { ManagedFile } from '@/hooks/file-manager/types';
import { formatBytes, getDisplayName } from '@/utils/fileUtils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FileOrganizer, FileFolder } from './FileOrganizer';
import { RecentFiles } from './RecentFiles';
import { FilePreview } from './FilePreview';
import { BulkActions } from './BulkActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Enhanced File Manager with organization, recent files, previews, and bulk operations
 */
export const EnhancedFileManager: React.FC = () => {
  const { files, loading, uploadFile, deleteFile, downloadFile } = useFileManager();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Local state for file management features
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<FileFolder[]>([]);
  const [recentFiles, setRecentFiles] = useState<ManagedFile[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Initialize recent files and folders
  useEffect(() => {
    // Sort files by last modified and take the most recent
    const sortedFiles = [...files].sort((a, b) => b.lastModified - a.lastModified);
    setRecentFiles(sortedFiles.slice(0, 10));
    
    // Initialize folders with actual file counts
    const updatedFolders = folders.map(folder => ({
      ...folder,
      file_count: files.filter(f => f.folderId === folder.id).length
    }));
    
    // If no folders exist yet, create some demo folders
    if (folders.length === 0) {
      setFolders([
        { id: '1', name: 'Documents', created_at: new Date().toISOString(), file_count: files.filter(f => f.folderId === '1').length },
        { id: '2', name: 'Images', created_at: new Date().toISOString(), file_count: files.filter(f => f.folderId === '2').length },
        { id: '3', name: 'Research', created_at: new Date().toISOString(), file_count: files.filter(f => f.folderId === '3').length },
      ]);
    } else {
      setFolders(updatedFolders);
    }
  }, [files]);

  // Get files for current view
  const getDisplayFiles = () => {
    if (selectedFolderId) {
      return files.filter(f => f.folderId === selectedFolderId);
    }
    return files;
  };

  const displayFiles = getDisplayFiles();
  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  // File selection handlers
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(displayFiles.map(f => f.id)));
  };

  const deselectAllFiles = () => {
    setSelectedFiles(new Set());
  };

  // Bulk operations
  const handleBulkDelete = async (fileIds: string[]) => {
    const filesToDelete = files.filter(f => fileIds.includes(f.id));
    for (const file of filesToDelete) {
      await deleteFile(file);
    }
    setSelectedFiles(new Set());
    toast({
      title: "Files deleted",
      description: `${fileIds.length} file(s) have been deleted`,
    });
  };

  const handleBulkDownload = async (fileIds: string[]) => {
    const filesToDownload = files.filter(f => fileIds.includes(f.id));
    for (const file of filesToDownload) {
      await downloadFile(file);
    }
    toast({
      title: "Files downloaded",
      description: `${fileIds.length} file(s) have been downloaded`,
    });
  };

  const handleBulkMove = (fileIds: string[], folderId: string) => {
    // Update files with new folder assignment
    // In a real app, this would update the backend
    const folderName = folders.find(f => f.id === folderId)?.name || 'Unknown';
    toast({
      title: "Files moved",
      description: `${fileIds.length} file(s) moved to ${folderName}`,
    });
    setSelectedFiles(new Set());
  };

  // Folder operations
  const handleCreateFolder = (name: string) => {
    const newFolder: FileFolder = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
      file_count: 0
    };
    setFolders([...folders, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
    // If we're currently viewing this folder, go back to all files
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
    toast({
      title: "Folder deleted",
      description: "Folder has been removed",
    });
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setActiveTab('all'); // Switch to files view when selecting a folder
    deselectAllFiles(); // Clear selection when changing folder
  };

  const handleBackToAllFiles = () => {
    setSelectedFolderId(null);
    deselectAllFiles();
  };

  // File upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Open file in workspace
  const openInWorkspace = (file: ManagedFile) => {
    const cleanName = file.displayName || getDisplayName(file.name);
    
    sessionStorage.setItem('selectedFileId', file.id);
    if (file.url) {
      sessionStorage.setItem('selectedFileUrl', file.url);
    }
    
    const displayName = cleanName.match(/^\d/) ? 'My File' : cleanName;
    sessionStorage.setItem('selectedFileName', displayName);
    
    navigate('/');
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedFolderId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToAllFiles}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {selectedFolderId ? (
                  <span className="flex items-center gap-2">
                    <Folder className="h-6 w-6" />
                    {selectedFolder?.name}
                  </span>
                ) : (
                  'My Files'
                )}
              </h1>
              <p className="text-muted-foreground">Manage and organize your documents</p>
            </div>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            {selectedFolderId ? 'Folder Files' : 'All Files'}
          </TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="organize">Organize</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <RecentFiles
            recentFiles={recentFiles}
            onFileSelect={(file) => {/* Handle file selection */}}
            onOpenInWorkspace={openInWorkspace}
          />
        </TabsContent>

        <TabsContent value="folders" className="space-y-4">
          <FileOrganizer
            files={files}
            folders={folders}
            selectedFiles={selectedFiles}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveToFolder={handleBulkMove}
            onFolderClick={handleFolderClick}
          />
        </TabsContent>

        <TabsContent value="organize" className="space-y-4">
          <BulkActions
            selectedFiles={selectedFiles}
            files={displayFiles}
            folders={folders}
            onSelectAll={selectAllFiles}
            onDeselectAll={deselectAllFiles}
            onBulkDelete={handleBulkDelete}
            onBulkMove={handleBulkMove}
            onBulkDownload={handleBulkDownload}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {displayFiles.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">
                {selectedFolderId ? 'No files in this folder' : 'No files found'}
              </h3>
              <p className="text-muted-foreground">
                {selectedFolderId ? 'Move files to this folder to see them here.' : 'Upload files to see them here.'}
              </p>
            </div>
          ) : (
            <>
              {selectedFiles.size > 0 && (
                <BulkActions
                  selectedFiles={selectedFiles}
                  files={displayFiles}
                  folders={folders}
                  onSelectAll={selectAllFiles}
                  onDeselectAll={deselectAllFiles}
                  onBulkDelete={handleBulkDelete}
                  onBulkMove={handleBulkMove}
                  onBulkDownload={handleBulkDownload}
                />
              )}
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={displayFiles.length === selectedFiles.size ? deselectAllFiles : selectAllFiles}
                          className="h-8 w-8 p-0"
                        >
                          {displayFiles.length === selectedFiles.size ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayFiles.map(file => {
                      const displayName = file.displayName || getDisplayName(file.name);
                      const cleanDisplayName = displayName.match(/^\d/) ? 'My File' : displayName;
                      const isSelected = selectedFiles.has(file.id);
                      
                      return (
                        <TableRow 
                          key={file.id}
                          className={isSelected ? 'bg-accent/50' : ''}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFileSelection(file.id)}
                              className="h-8 w-8 p-0"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <FilePreview file={file} size="sm" />
                          </TableCell>
                          <TableCell className="font-medium">{cleanDisplayName}</TableCell>
                          <TableCell>{file.type}</TableCell>
                          <TableCell>{formatBytes(file.size)}</TableCell>
                          <TableCell>{formatDate(file.lastModified)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openInWorkspace(file)}
                                aria-label="Open in workspace"
                                title="Open in workspace"
                              >
                                <FolderOpen className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => downloadFile(file)}
                                aria-label="Download file"
                                title="Download file"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteFile(file)}
                                aria-label="Delete file"
                                title="Delete file"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
