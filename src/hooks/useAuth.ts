import { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle, signOut } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsProfileSetup: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    needsProfileSetup: false,
  });

  useEffect(() => {
    // Get initial session
    console.log('useAuth: Getting initial session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('useAuth: Initial session result:', { session: session?.user?.email, error });
      if (session?.user) {
        fetchProfile(session.user.id, session);
      } else {
        console.log('useAuth: No session found');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.email);
        if (event === 'SIGNED_IN' && session?.user) {
          fetchProfile(session.user.id, session);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            needsProfileSetup: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, session: Session) => {
    console.log('useAuth: Fetching profile for user:', userId);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('useAuth: Profile fetch result:', { profile, error });

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }

    const profileData = profile as Profile | null;
    const needsSetup = !profileData?.baby_name;

    setAuthState({
      user: session.user,
      profile: profileData,
      session,
      isLoading: false,
      isAuthenticated: true,
      needsProfileSetup: needsSetup,
    });
  };

  const updateProfile = async (babyName: string) => {
    if (!authState.user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: authState.user.id,
        baby_name: babyName,
      })
      .select()
      .single();

    if (!error && data) {
      setAuthState(prev => ({
        ...prev,
        profile: data as Profile,
        needsProfileSetup: false,
      }));
    }

    return { data, error };
  };

  return {
    ...authState,
    signInWithGoogle,
    signOut,
    updateProfile,
  };
}
