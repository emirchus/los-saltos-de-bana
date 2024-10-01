export interface BingoRoom {
  called_numbers: number[] | null;
  created_at: string;
  id: number;
  join_code: string | null;
  name: string;
  status: string;
  updated_at: string;
}
