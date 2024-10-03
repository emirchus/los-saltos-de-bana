import { Database } from '@/types_db';

export type BingoRoom = Database['public']['Tables']['bingo_rooms']['Row'] & {
  created_by: {
    id: string;
    username: string;
  };
};
