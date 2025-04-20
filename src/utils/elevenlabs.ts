
import { handleError } from './errorHandling';
import { supabase } from '@/integrations/supabase/client';

interface TextToSpeechOptions {
  voiceId?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
}

/**
 * Interface for the ElevenLabs API client
 */
export class ElevenLabsClient {
  private apiKey: string | null = null;
  private defaultVoiceId = "21m00Tcm4TlvDq8ikWAM"; // default voice (Rachel)
  private defaultModel = "eleven_monolingual_v1";
  
  constructor() {
    // API key will be fetched from Supabase when needed
  }
  
  /**
   * Initialize the client with API key from Supabase
   */
  async initialize(): Promise<boolean> {
    try {
      // Attempt to get API key from Supabase
      const { data, error } = await supabase
        .from('secrets')
        .select('secret')
        .eq('name', 'ELEVENLABS_API_KEY')
        .single();
        
      if (error || !data?.secret) {
        console.log('ElevenLabs API key not found in Supabase');
        return false;
      }
      
      this.apiKey = data.secret;
      return true;
    } catch (error) {
      handleError(error, {
        title: 'ElevenLabs Initialization Error',
        fallbackMessage: 'Failed to initialize speech service',
        showToast: false
      });
      return false;
    }
  }
  
  /**
   * Check if client is ready (has API key)
   */
  isReady(): boolean {
    return !!this.apiKey;
  }
  
  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(
    text: string, 
    options: TextToSpeechOptions = {}
  ): Promise<Blob | null> {
    if (!this.apiKey) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('ElevenLabs client not initialized');
      }
    }
  
    try {
      const {
        voiceId = this.defaultVoiceId,
        model = this.defaultModel,
        stability = 0.5,
        similarityBoost = 0.5
      } = options;
      
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey as string
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }
      
      return await response.blob();
    } catch (error) {
      handleError(error, {
        title: 'Text-to-Speech Error',
        fallbackMessage: 'Failed to convert text to speech'
      });
      return null;
    }
  }
  
  /**
   * Get available voices from ElevenLabs API
   */
  async getVoices() {
    if (!this.apiKey) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('ElevenLabs client not initialized');
      }
    }
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey as string
        }
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      handleError(error, {
        title: 'Voice List Error',
        fallbackMessage: 'Failed to fetch available voices'
      });
      return [];
    }
  }
}

// Export a singleton instance
export const elevenlabs = new ElevenLabsClient();

// Hook for using text-to-speech in React components
export const useTextToSpeech = () => {
  /**
   * Speak text using ElevenLabs API
   */
  const speak = async (
    text: string, 
    options?: TextToSpeechOptions
  ): Promise<boolean> => {
    try {
      const audioBlob = await elevenlabs.textToSpeech(text, options);
      if (!audioBlob) return false;
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      return true;
    } catch (error) {
      handleError(error, {
        title: 'Speech Error',
        fallbackMessage: 'Failed to play text-to-speech audio'
      });
      return false;
    }
  };
  
  return { speak };
};
