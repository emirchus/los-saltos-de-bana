'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { Profile } from '@/interface/profile';
import { supabase } from '@/lib/supabase/client';
import { fetchUserInfo } from '@/lib/supabase/query';

import type { User } from '@supabase/supabase-js';

type UserContextType = {
  user: User | null;
  profile: Profile | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  defaultUser,
  defaultProfile,
}: {
  children: React.ReactNode;
  defaultUser: User | null;
  defaultProfile: Profile | null;
}) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [profile, setProfile] = useState<Profile | null>(defaultProfile);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null);
          if (session?.user) {
            const data = await fetchUserInfo(supabase, session.user.id);
            console.log(data);

            setProfile(data);
          }
          break;
        case 'SIGNED_OUT':
          setUser(null);
          break;
        case 'INITIAL_SESSION':
          setUser(session?.user ?? null);
          break;
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, profile }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
