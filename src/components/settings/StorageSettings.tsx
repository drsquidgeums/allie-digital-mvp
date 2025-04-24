
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/ui/use-toast";

export const StorageSettings = () => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(5 * 1024 * 1024 * 1024); // 5GB default
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        // Get all files to calculate total size
        const { data: files, error } = await supabase
          .storage
          .from('files')
          .list();

        if (error) {
          throw error;
        }
        
        // Calculate total size - this is an approximation
        // In a production app, you might want to track this more precisely
        let totalSize = 0;
        if (files) {
          for (const file of files) {
            if (file.metadata?.size) {
              totalSize += file.metadata.size;
            }
          }
        }
        
        setStorageUsed(totalSize);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching storage stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch storage statistics",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchStorageStats();
  }, [toast]);

  const clearStorage = async () => {
    try {
      const { data: files, error: listError } = await supabase
        .storage
        .from('files')
        .list();

      if (listError) {
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map(file => file.name);
        
        const { error: deleteError } = await supabase
          .storage
          .from('files')
          .remove(filePaths);

        if (deleteError) {
          throw deleteError;
        }
        
        setStorageUsed(0);
        toast({
          title: "Success",
          description: "All files have been cleared from storage",
        });
      } else {
        toast({
          title: "Information",
          description: "No files to clear",
        });
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
      toast({
        title: "Error",
        description: "Failed to clear storage",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Data & Storage</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Storage Usage (Supabase)</Label>
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Calculating...' : `${formatBytes(storageUsed)} / ${formatBytes(storageLimit)}`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : storagePercentage} />
        </div>

        <div className="space-y-2">
          <Label>Storage Management</Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearStorage}
              disabled={isLoading || storageUsed === 0}
            >
              Clear All Files
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.clear();
                toast({
                  title: "Success",
                  description: "Local storage has been cleared",
                });
              }}
            >
              Clear Local Storage
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Export Data</Label>
          <p className="text-sm text-muted-foreground">Download all your workspace data including documents, annotations, and settings</p>
          <Button variant="outline" size="sm">Download My Data</Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};
