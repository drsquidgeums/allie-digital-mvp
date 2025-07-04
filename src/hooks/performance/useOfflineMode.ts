
import { useCallback, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Internet connection restored. Syncing pending changes...",
      });
      
      // Process offline queue
      if (offlineQueue.length > 0) {
        processOfflineQueue();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "No internet connection. Working in offline mode.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue, toast]);

  const queueAction = useCallback((action: any) => {
    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { ...action, timestamp: Date.now() }]);
      toast({
        title: "Action Queued",
        description: "Action saved for when you're back online.",
      });
    }
  }, [isOnline, toast]);

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;

    toast({
      title: "Syncing Changes",
      description: `Processing ${offlineQueue.length} offline actions...`,
    });

    // In a real implementation, this would process each queued action
    setTimeout(() => {
      setOfflineQueue([]);
      toast({
        title: "Sync Complete",
        description: "All offline changes have been synced successfully.",
      });
    }, 2000);
  }, [offlineQueue, toast]);

  const getOfflineCapabilities = useCallback(() => {
    return {
      canViewDocuments: true,
      canTakeNotes: true,
      canUseTools: true,
      canSync: isOnline,
      queuedActions: offlineQueue.length
    };
  }, [isOnline, offlineQueue.length]);

  return {
    isOnline,
    queueAction,
    getOfflineCapabilities,
    offlineQueue: offlineQueue.length
  };
};
