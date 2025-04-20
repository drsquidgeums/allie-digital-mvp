
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface SavedUrl {
  id: string;
  url: string;
  name: string;
  created_at: string;
  last_accessed: string | null;
}

export const useSavedUrls = () => {
  const [savedUrls, setSavedUrls] = useState<SavedUrl[]>([]);
  const { toast } = useToast();

  const saveUrl = async (url: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('saved_urls')
        .insert({
          url,
          name: url.split('/').pop() || 'Untitled Document',
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSavedUrls(prev => [...prev, data]);
      
      toast({
        title: "URL Saved",
        description: "The document URL has been saved to My Files",
      });

      return data;
    } catch (error) {
      console.error('Error saving URL:', error);
      toast({
        title: "Error",
        description: "Failed to save URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchSavedUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_urls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedUrls(data || []);
    } catch (error) {
      console.error('Error fetching saved URLs:', error);
    }
  };

  useEffect(() => {
    fetchSavedUrls();
  }, []);

  return {
    savedUrls,
    saveUrl,
    refreshUrls: fetchSavedUrls
  };
};
