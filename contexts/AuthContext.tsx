import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { AppState } from 'react-native';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role?: string | null;
  created_at?: string | null;
};

type AuthContextType = {
  session: any | null;
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  triggerRefresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const upsertProfile = async (user: any) => {
   
    if (!user) return;
    
    const meta = user.user_metadata || {};

    try {
      
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - that's okay, means profile doesn't exist
        console.error('Error checking existing profile:', checkError);
        return;
      }
     
      if (existingProfile) {
        // Profile exists - only update email, full_name, avatar_url, but preserve role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            email: user.email,
            full_name: meta.full_name || meta.name || null,
            avatar_url: meta.avatar_url || meta.picture || null,
            updated_at: new Date().toISOString(),
            // DO NOT include role in update - preserve existing role
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile (role should be preserved):', updateError);
        } else {
          console.log('Profile updated successfully, role preserved:', existingProfile.role);
        }
      } else {
        // Profile doesn't exist - create new one with default role 'user'
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: meta.full_name || meta.name || null,
          avatar_url: meta.avatar_url || meta.picture || null,
          role: 'user', // Only set role for new profiles
          created_at: user.created_at || new Date().toISOString(),
        });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error upserting profile:', error);
    }
  };

  const loadProfile = async (user: any) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) setProfile(data);
  };

  const triggerRefresh = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      setSession(data.session);
      await upsertProfile(data.session.user);
      await loadProfile(data.session.user);
    }
  };

  useEffect( () => {
    const { data: authSub } =  supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        
        setSession(newSession);
        console.log("Auth event:", event, "User logged in. Syncing profile in background...");
        
        // Push this to the next tick of the event loop
       
       
        // console.log(JSON.stringify(newSession?.user))
        if (newSession?.user) {
          setTimeout(() => {
            syncUserMetadata(newSession.user);
          }, 0);
         
        //   await upsertProfile(newSession.user);
         
        //   await loadProfile(newSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => authSub.subscription.unsubscribe();
  }, []);
  const syncUserMetadata = async (user: any) => {
    try {
      // Now this query won't hang because setSession has finished
      await upsertProfile(user);
      await loadProfile(user);
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        profile,
        loading,
        signOut,
        triggerRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
