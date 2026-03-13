
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const StorageSettings = () => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(1 * 1024 * 1024 * 1024); // 1GB (Supabase free tier)
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Files are stored under {userId}/ path
        const { data: files, error } = await supabase
          .storage
          .from('files')
          .list(user.id, { limit: 1000 });

        if (error) {
          throw error;
        }
        
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
          title: t('common.error', 'Error'),
          description: t('settings.storage.fetchError', 'Failed to fetch storage statistics'),
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchStorageStats();
  }, [toast, t]);

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
          title: t('common.success', 'Success'),
          description: t('settings.storage.clearedFiles', 'All files have been cleared from storage'),
        });
      } else {
        toast({
          title: t('common.information', 'Information'),
          description: t('settings.storage.noFiles', 'No files to clear'),
        });
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
      toast({
        title: t('common.error', 'Error'),
        description: t('settings.storage.clearError', 'Failed to clear storage'),
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
      <h3 className="text-lg font-medium">{t('settings.storage.title', 'Data & Storage')}</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('settings.storage.usage', 'Storage Usage (Supabase)')}</Label>
            <span className="text-sm text-muted-foreground">
              {isLoading ? t('common.loading', 'Calculating...') : `${formatBytes(storageUsed)} / ${formatBytes(storageLimit)}`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : storagePercentage} />
        </div>

        <div className="space-y-2">
          <Label>{t('settings.storage.management', 'Storage Management')}</Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearStorage}
              disabled={isLoading || storageUsed === 0}
            >
              {t('settings.storage.clearFiles', 'Clear All Files')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.clear();
                toast({
                  title: t('common.success', 'Success'),
                  description: t('settings.storage.localStorageCleared', 'Local storage has been cleared'),
                });
              }}
            >
              {t('settings.storage.clearLocalStorage', 'Clear Local Storage')}
            </Button>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};
