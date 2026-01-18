export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bingo_rooms: {
        Row: {
          called_numbers: number[] | null
          created_at: string
          created_by: string | null
          id: number
          join_code: string | null
          name: string
          players: number
          privacity: Database["public"]["Enums"]["room_privacity"]
          status: string
          updated_at: string
        }
        Insert: {
          called_numbers?: number[] | null
          created_at?: string
          created_by?: string | null
          id?: number
          join_code?: string | null
          name: string
          players?: number
          privacity?: Database["public"]["Enums"]["room_privacity"]
          status: string
          updated_at?: string
        }
        Update: {
          called_numbers?: number[] | null
          created_at?: string
          created_by?: string | null
          id?: number
          join_code?: string | null
          name?: string
          players?: number
          privacity?: Database["public"]["Enums"]["room_privacity"]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bingo_rooms_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_by: string
          id: number
          inserted_at: string
          slug: string
        }
        Insert: {
          created_by: string
          id?: number
          inserted_at?: string
          slug: string
        }
        Update: {
          created_by?: string
          id?: number
          inserted_at?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels_settings: {
        Row: {
          allow_commands_offstream: boolean
          base_points: number
          channel: string
          enabled: boolean
          max_walltext_timeout: number
          presente_cooldown_minutes: number
          presente_enabled: boolean
          presente_points: number
          timeout_walltext: number
          updated_at: string
          wall_bonus_points: number
          wall_boost_enabled: boolean
          wall_min_chars: number
        }
        Insert: {
          allow_commands_offstream?: boolean
          base_points?: number
          channel: string
          enabled?: boolean
          max_walltext_timeout?: number
          presente_cooldown_minutes?: number
          presente_enabled?: boolean
          presente_points?: number
          timeout_walltext?: number
          updated_at?: string
          wall_bonus_points?: number
          wall_boost_enabled?: boolean
          wall_min_chars?: number
        }
        Update: {
          allow_commands_offstream?: boolean
          base_points?: number
          channel?: string
          enabled?: boolean
          max_walltext_timeout?: number
          presente_cooldown_minutes?: number
          presente_enabled?: boolean
          presente_points?: number
          timeout_walltext?: number
          updated_at?: string
          wall_bonus_points?: number
          wall_boost_enabled?: boolean
          wall_min_chars?: number
        }
        Relationships: []
      }
      donation_status_history: {
        Row: {
          created_at: string | null
          donation_id: string | null
          id: string
          new_status: string | null
          payment_id: string | null
          previous_status: string | null
        }
        Insert: {
          created_at?: string | null
          donation_id?: string | null
          id?: string
          new_status?: string | null
          payment_id?: string | null
          previous_status?: string | null
        }
        Update: {
          created_at?: string | null
          donation_id?: string | null
          id?: string
          new_status?: string | null
          payment_id?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_status_history_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          audio_url: string | null
          created_at: string | null
          external_reference: string | null
          id: string
          is_anonymous: boolean | null
          payment_id: string | null
          payment_status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          amount: number
          audio_url?: string | null
          created_at?: string | null
          external_reference?: string | null
          id?: string
          is_anonymous?: boolean | null
          payment_id?: string | null
          payment_status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          amount?: number
          audio_url?: string | null
          created_at?: string | null
          external_reference?: string | null
          id?: string
          is_anonymous?: boolean | null
          payment_id?: string | null
          payment_status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      environment_variables: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      integration_credentials: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          public_key: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          public_key: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          public_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_status: {
        Row: {
          access_token_valid: boolean | null
          connected: boolean | null
          created_at: string | null
          id: string
          last_checked: string | null
          public_key_valid: boolean | null
          updated_at: string | null
          webhook_configured: boolean | null
        }
        Insert: {
          access_token_valid?: boolean | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          last_checked?: string | null
          public_key_valid?: boolean | null
          updated_at?: string | null
          webhook_configured?: boolean | null
        }
        Update: {
          access_token_valid?: boolean | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          last_checked?: string | null
          public_key_valid?: boolean | null
          updated_at?: string | null
          webhook_configured?: boolean | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: number
          name: string | null
          type: Database["public"]["Enums"]["location_type"] | null
          video: string | null
          x: number | null
          y: number | null
        }
        Insert: {
          id?: never
          name?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          video?: string | null
          x?: number | null
          y?: number | null
        }
        Update: {
          id?: never
          name?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          video?: string | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          channel_id: number
          id: number
          inserted_at: string
          message: string | null
          user_id: string
        }
        Insert: {
          channel_id: number
          id?: number
          inserted_at?: string
          message?: string | null
          user_id: string
        }
        Update: {
          channel_id?: number
          id?: number
          inserted_at?: string
          message?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_boards: {
        Row: {
          board: Json
          created_at: string
          id: string
          room_id: number
          user_id: string
        }
        Insert: {
          board: Json
          created_at?: string
          id?: string
          room_id: number
          user_id: string
        }
        Update: {
          board?: Json
          created_at?: string
          id?: string
          room_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_boards_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "bingo_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          sub: boolean
          updated_at: string | null
          urls: string[] | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          sub?: boolean
          updated_at?: string | null
          urls?: string[] | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          sub?: boolean
          updated_at?: string | null
          urls?: string[] | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      stream_sessions: {
        Row: {
          channel: string
          ended_at: string | null
          id: string
          is_live: boolean
          started_at: string
        }
        Insert: {
          channel: string
          ended_at?: string | null
          id: string
          is_live?: boolean
          started_at?: string
        }
        Update: {
          channel?: string
          ended_at?: string | null
          id?: string
          is_live?: boolean
          started_at?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          channel: string
          is_og: boolean
          messages_count: number
          points: number
          profile_pic: string | null
          stars: number
          updated_at: string
          user_id: string
          username: string
          walltext_count: number
        }
        Insert: {
          channel: string
          is_og?: boolean
          messages_count?: number
          points?: number
          profile_pic?: string | null
          stars?: number
          updated_at?: string
          user_id: string
          username: string
          walltext_count?: number
        }
        Update: {
          channel?: string
          is_og?: boolean
          messages_count?: number
          points?: number
          profile_pic?: string | null
          stars?: number
          updated_at?: string
          user_id?: string
          username?: string
          walltext_count?: number
        }
        Relationships: []
      }
      user_stats_session: {
        Row: {
          channel: string
          messages_count: number
          points: number
          session_id: string
          user_id: string
          username: string
          walltext_count: number
        }
        Insert: {
          channel: string
          messages_count?: number
          points?: number
          session_id: string
          user_id: string
          username: string
          walltext_count?: number
        }
        Update: {
          channel?: string
          messages_count?: number
          points?: number
          session_id?: string
          user_id?: string
          username?: string
          walltext_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stream_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_retry_queue: {
        Row: {
          attempt: number
          created_at: string | null
          external_reference: string
          id: string
          last_error: string | null
          next_retry_at: string | null
          payment_id: string
          processed: boolean | null
          status: string
        }
        Insert: {
          attempt: number
          created_at?: string | null
          external_reference: string
          id?: string
          last_error?: string | null
          next_retry_at?: string | null
          payment_id: string
          processed?: boolean | null
          status: string
        }
        Update: {
          attempt?: number
          created_at?: string | null
          external_reference?: string
          id?: string
          last_error?: string | null
          next_retry_at?: string | null
          payment_id?: string
          processed?: boolean | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_message_event: {
        Args: {
          p_channel: string
          p_is_wall: boolean
          p_points: number
          p_session_id: string
          p_user_id: string
          p_username: string
        }
        Returns: undefined
      }
      apply_presente: {
        Args: {
          p_channel: string
          p_points: number
          p_session_id: string
          p_user_id: string
          p_username: string
        }
        Returns: undefined
      }
      create_bingo_room:
        | {
            Args: {
              room_name: string
              room_privacity: Database["public"]["Enums"]["room_privacity"]
            }
            Returns: {
              called_numbers: number[] | null
              created_at: string
              created_by: string | null
              id: number
              join_code: string | null
              name: string
              players: number
              privacity: Database["public"]["Enums"]["room_privacity"]
              status: string
              updated_at: string
            }
            SetofOptions: {
              from: "*"
              to: "bingo_rooms"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: {
              creator_id: string
              room_name: string
              room_privacity: Database["public"]["Enums"]["room_privacity"]
            }
            Returns: {
              called_numbers: number[] | null
              created_at: string
              created_by: string | null
              id: number
              join_code: string | null
              name: string
              players: number
              privacity: Database["public"]["Enums"]["room_privacity"]
              status: string
              updated_at: string
            }
            SetofOptions: {
              from: "*"
              to: "bingo_rooms"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      generate_unique_join_code: { Args: never; Returns: string }
      get_or_create_player_board: {
        Args: { p_board: Json; p_room_id: number; p_user_id: string }
        Returns: Json
      }
      get_user_by_id: {
        Args: { user_id: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          sub: boolean
          updated_at: string | null
          urls: string[] | null
          username: string | null
          website: string | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      location_type: "salto" | "clip" | "fail"
      room_privacity: "public" | "private" | "hidden"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      location_type: ["salto", "clip", "fail"],
      room_privacity: ["public", "private", "hidden"],
    },
  },
} as const
