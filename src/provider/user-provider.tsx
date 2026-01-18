'use client';

import type { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SignInAlert } from '@/components/sign-in-alert';
import { Profile } from '@/interface/profile';
import { supabase } from '@/lib/supabase/client';
import { fetchUserInfo } from '@/lib/supabase/query';

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  signInAlertOpen: boolean;
  setSignInAlertOpen: (open: boolean) => void;
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
  const [signInAlertOpen, setSignInAlertOpen] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event);

      switch (event) {
        case 'USER_UPDATED':
        case 'TOKEN_REFRESHED':
        case 'MFA_CHALLENGE_VERIFIED':
        case 'SIGNED_IN':
        case 'INITIAL_SESSION':
          setUser(session?.user ?? null);

          if (session?.user) {
            setTimeout(async () => {
              const data = await fetchUserInfo(supabase, session.user.id);
              setProfile(data);
            });
          }
          break;
        case 'SIGNED_OUT':
        default:
          setUser(null);
          setProfile(null);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, signInAlertOpen, setSignInAlertOpen }}>
      <SignInAlert open={signInAlertOpen} onOpenChange={setSignInAlertOpen} />
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
