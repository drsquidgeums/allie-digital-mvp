
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface TeamsAuthConfig {
  clientId: string;
  tenantId: string;
}

export const connectToTeams = async () => {
  try {
    // Microsoft Teams OAuth endpoint
    const teamsAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`;
    
    // Try to get Teams credentials from Supabase, but handle the case where the table doesn't exist
    const { data: config, error: configError } = await supabase
      .from('teams_config')
      .select('*')
      .single();
    
    if (configError || !config) {
      console.error('Teams configuration not found in Supabase');
      throw new Error('Teams configuration not available. Please set up the teams_config table in Supabase with client_id and tenant_id columns.');
    }

    // Check if the config has the required properties
    if (!config.client_id || !config.tenant_id) {
      throw new Error('Invalid Teams configuration. Missing client_id or tenant_id.');
    }

    // Construct OAuth URL with required parameters
    const params = new URLSearchParams({
      client_id: config.client_id,
      response_type: 'code',
      redirect_uri: `${window.location.origin}/teams-callback`,
      scope: 'https://api.teams.microsoft.com/.default',
      response_mode: 'query'
    });

    // Open Teams login in a popup window
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    window.open(
      `${teamsAuthUrl}?${params.toString()}`,
      'Teams Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    return true;
  } catch (error) {
    console.error('Teams connection error:', error);
    throw error;
  }
};
