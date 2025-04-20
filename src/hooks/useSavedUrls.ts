
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface SavedUrl {
  id: string;
  url: string;
  name: string;
  created_at: string;
  last_accessed: string | null;
}

export function useSavedUrls() {
  const [savedUrls, setSavedUrls] = useState<SavedUrl[]>([]);
  const { toast } = useToast();

  const saveUrl = async (url: string) => {
    try {
      const name = new URL(url).hostname;
      const { data, error } = await supabase
        .from('saved_urls')
        .insert([{ url, name }])
        .select()
        .single();

      if (error) throw error;

      setSavedUrls(prev => [...prev, data]);
      toast({
        title: "URL saved",
        description: "The URL has been saved to your files",
      });
    } catch (error) {
      console.error('Error saving URL:', error);
      toast({
        title: "Error saving URL",
        description: "There was a problem saving the URL",
        variant: "destructive",
      });
    }
  };

  const loadSavedUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_urls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedUrls(data || []);
    } catch (error) {
      console.error('Error loading saved URLs:', error);
    }
  };

  useEffect(() => {
    loadSavedUrls();
  }, []);

  return { savedUrls, saveUrl };
}
