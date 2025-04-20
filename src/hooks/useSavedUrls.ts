
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveUrl = async (url: string) => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      // Create a meaningful name from the URL
      let name = url.split('/').pop() || 'Untitled Document';
      // Remove query parameters if present
      name = name.split('?')[0];
      // Remove file extension if present
      name = name.replace(/\.[^/.]+$/, "");
      // Decode URL encoding
      name = decodeURIComponent(name);
      // Limit name length and capitalize
      name = name.length > 30 ? name.substring(0, 30) + '...' : name;
      name = name.charAt(0).toUpperCase() + name.slice(1);

      // If user is not authenticated, store in local storage
      if (!userData?.user) {
        const localUrls = JSON.parse(localStorage.getItem('savedUrls') || '[]');
        const newUrl = {
          id: crypto.randomUUID(),
          url,
          name: name || 'Untitled Document',
          created_at: new Date().toISOString(),
          last_accessed: null
        };
        
        localStorage.setItem('savedUrls', JSON.stringify([newUrl, ...localUrls]));
        setSavedUrls(prev => [newUrl, ...prev]);
        return newUrl;
      }

      // If authenticated, save to database
      const { data, error } = await supabase
        .from('saved_urls')
        .insert({
          url,
          name: name || 'Untitled Document',
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new URL to the state
      setSavedUrls(prev => [data, ...prev]);
      
      return data;
    } catch (error) {
      console.error('Error saving URL:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedUrls = async () => {
    try {
      setLoading(true);
      
      // Try to get authenticated user
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Fetch from database for authenticated users
        const { data, error } = await supabase
          .from('saved_urls')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedUrls(data || []);
      } else {
        // Fetch from local storage for unauthenticated users
        const localUrls = JSON.parse(localStorage.getItem('savedUrls') || '[]');
        setSavedUrls(localUrls);
      }
    } catch (error) {
      console.error('Error fetching saved URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedUrls();
  }, []);

  return {
    savedUrls,
    loading,
    saveUrl,
    refreshUrls: fetchSavedUrls
  };
};
