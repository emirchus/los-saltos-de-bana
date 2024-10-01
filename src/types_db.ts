export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bingo_rooms: {
        Row: {
          called_numbers: number[] | null;
          created_at: string;
          created_by: string | null;
          id: number;
          join_code: string | null;
          name: string;
          players: number;
          privacity: Database['public']['Enums']['room_privacity'];
          status: string;
          updated_at: string;
        };
        Insert: {
          called_numbers?: number[] | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          join_code?: string | null;
          name: string;
          players?: number;
          privacity?: Database['public']['Enums']['room_privacity'];
          status: string;
          updated_at?: string;
        };
        Update: {
          called_numbers?: number[] | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          join_code?: string | null;
          name?: string;
          players?: number;
          privacity?: Database['public']['Enums']['room_privacity'];
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bingo_rooms_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bingo_rooms_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      channels: {
        Row: {
          created_by: string;
          id: number;
          inserted_at: string;
          slug: string;
        };
        Insert: {
          created_by: string;
          id?: number;
          inserted_at?: string;
          slug: string;
        };
        Update: {
          created_by?: string;
          id?: number;
          inserted_at?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'channels_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      locations: {
        Row: {
          id: number;
          name: string | null;
          type: Database['public']['Enums']['location_type'] | null;
          video: string | null;
          x: number | null;
          y: number | null;
        };
        Insert: {
          id?: never;
          name?: string | null;
          type?: Database['public']['Enums']['location_type'] | null;
          video?: string | null;
          x?: number | null;
          y?: number | null;
        };
        Update: {
          id?: never;
          name?: string | null;
          type?: Database['public']['Enums']['location_type'] | null;
          video?: string | null;
          x?: number | null;
          y?: number | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          channel_id: number;
          id: number;
          inserted_at: string;
          message: string | null;
          user_id: string;
        };
        Insert: {
          channel_id: number;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          user_id: string;
        };
        Update: {
          channel_id?: number;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      player_boards: {
        Row: {
          board: Json;
          created_at: string;
          id: string;
          room_id: number;
          user_id: string;
        };
        Insert: {
          board: Json;
          created_at?: string;
          id?: string;
          room_id: number;
          user_id: string;
        };
        Update: {
          board?: Json;
          created_at?: string;
          id?: string;
          room_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'player_boards_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'bingo_rooms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'player_boards_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          full_name: string | null;
          id: string;
          sub: boolean;
          updated_at: string | null;
          urls: string[] | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id: string;
          sub?: boolean;
          updated_at?: string | null;
          urls?: string[] | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id?: string;
          sub?: boolean;
          updated_at?: string | null;
          urls?: string[] | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_bingo_room:
        | {
            Args: {
              room_name: string;
              room_privacity: Database['public']['Enums']['room_privacity'];
            };
            Returns: {
              called_numbers: number[] | null;
              created_at: string;
              created_by: string | null;
              id: number;
              join_code: string | null;
              name: string;
              players: number;
              privacity: Database['public']['Enums']['room_privacity'];
              status: string;
              updated_at: string;
            };
          }
        | {
            Args: {
              room_name: string;
              room_privacity: Database['public']['Enums']['room_privacity'];
              creator_id: string;
            };
            Returns: {
              called_numbers: number[] | null;
              created_at: string;
              created_by: string | null;
              id: number;
              join_code: string | null;
              name: string;
              players: number;
              privacity: Database['public']['Enums']['room_privacity'];
              status: string;
              updated_at: string;
            };
          };
      generate_unique_join_code: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_or_create_player_board: {
        Args: {
          p_user_id: string;
          p_room_id: number;
          p_board: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      location_type: 'salto' | 'clip' | 'fail';
      room_privacity: 'public' | 'private' | 'hidden';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
