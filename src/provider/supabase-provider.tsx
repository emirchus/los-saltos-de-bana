'use client';

import { SupabaseContextProvider } from '@emirchus/use-supabase';
import React from 'react';

import { supabase } from '@/lib/supabase/client';

interface SupabaseClientProviderProps {
  children: React.ReactNode;
}

export const SupabaseClientProvider = ({ children }: SupabaseClientProviderProps) => {
  return <SupabaseContextProvider client={supabase}>{children}</SupabaseContextProvider>;
};
