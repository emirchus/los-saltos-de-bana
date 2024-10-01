'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

import type { Database } from '@/types_db';

type BingoRoom = Database['public']['Tables']['bingo_rooms']['Row'] & {
  createdBy: {
    id: string;
    full_name: string;
  };
};

interface RoomsContextType {
  rooms: BingoRoom[];
  loading: boolean;
  error: Error | null;
  refreshRooms: () => Promise<void>;
  hasMore: boolean;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider: React.FC<{
  children: React.ReactNode;
  initialRooms: BingoRoom[];
  initialTotalRooms: number;
}> = ({ children, initialRooms, initialTotalRooms }) => {
  const [rooms, setRooms] = useState<BingoRoom[]>(initialRooms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalRooms, setTotalRooms] = useState(initialTotalRooms);
  const [hasMore, setHasMore] = useState(initialRooms.length < totalRooms);

  const fetchRooms = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bingo_rooms')
        .select('*')
        .eq('status', 'active')
        .range(rooms.length, rooms.length + 9)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms([...rooms, ...(data || [])] as any);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const refreshRooms = async () => {
    await fetchRooms();
    const { count } = await supabase
      .from('bingo_rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .in('privacity', ['public', 'private']);

    const newTotalRooms = count || 0;

    setTotalRooms(newTotalRooms);

    setHasMore(newTotalRooms < rooms.length);
  };

  useEffect(() => {
    supabase
      .channel('public:bingo_rooms')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, payload => {
        setRooms(prev => {
          prev.push(payload.new as any);

          return prev;
        });
      })
      .subscribe();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, loading, error, refreshRooms, hasMore }}>{children}</RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
};
