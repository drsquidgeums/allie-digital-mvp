export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          rating: number
          usability: number
          user_id: string
          visual_appeal: number
          would_recommend: boolean
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          rating: number
          usability: number
          user_id: string
          visual_appeal: number
          would_recommend?: boolean
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          rating?: number
          usability?: number
          user_id?: string
          visual_appeal?: number
          would_recommend?: boolean
        }
        Relationships: []
      }
      nda_agreements: {
        Row: {
          agreed_at: string
          agreement_version: string
          email: string
          id: string
          ip_address: string | null
          name: string
        }
        Insert: {
          agreed_at?: string
          agreement_version?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
        }
        Update: {
          agreed_at?: string
          agreement_version?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
        }
        Relationships: []
      }
      saved_urls: {
        Row: {
          created_at: string
          id: string
          last_accessed: string | null
          name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_accessed?: string | null
          name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_accessed?: string | null
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          secret: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          secret: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          secret?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          color: string | null
          completed: boolean | null
          created_at: string | null
          id: string
          points: number | null
          text: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          points?: number | null
          text: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          points?: number | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      teams_config: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          tenant_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          tenant_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          tenant_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
