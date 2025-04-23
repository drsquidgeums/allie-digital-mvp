
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";

// Extend the existing Database type with our custom types
export interface ExtendedDatabase extends SupabaseDatabase {
  public: {
    Tables: {
      saved_urls: {
        Row: {
          created_at: string;
          id: string;
          last_accessed: string | null;
          name: string;
          url: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_accessed?: string | null;
          name: string;
          url: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_accessed?: string | null;
          name?: string;
          url?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string | null;
          text: string;
          completed: boolean | null;
          created_at: string | null;
          points: number | null;
          color: string | null;
          category: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          text: string;
          completed?: boolean | null;
          created_at?: string | null;
          points?: number | null;
          color?: string | null;
          category?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          text?: string;
          completed?: boolean | null;
          created_at?: string | null;
          points?: number | null;
          color?: string | null;
          category?: string | null;
        };
        Relationships: [];
      } & SupabaseDatabase['public']['Tables'];
      secrets: SupabaseDatabase['public']['Tables']['secrets'];
      teams_config: SupabaseDatabase['public']['Tables']['teams_config'];
    };
    Views: SupabaseDatabase['public']['Views'];
    Functions: SupabaseDatabase['public']['Functions'];
    Enums: SupabaseDatabase['public']['Enums'];
    CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
  };
}

// Helper type for accessing task table types
export type TaskRow = ExtendedDatabase['public']['Tables']['tasks']['Row'];
export type TaskInsert = ExtendedDatabase['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = ExtendedDatabase['public']['Tables']['tasks']['Update'];
