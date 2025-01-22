import { supabase } from '@/utils/supabase';
import { useToast } from "@/hooks/use-toast";

export interface TeamsAuthConfig {
  clientId: string;
  tenantId: string;
}

export const connectToTeams = async () => {
  try {
    // Microsoft Teams OAuth endpoint
    const teamsAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`;
    
    // Get Teams credentials from Supabase
    const { data: config, error: configError } = await supabase
      .from('teams_config')
      .select('client_id, tenant_id')
      .single();
    
    if (configError || !config) {
      throw new Error('Teams configuration not found');
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