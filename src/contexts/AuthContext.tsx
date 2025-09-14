import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, city: string, phoneNumber: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate a random avatar using the API
  const generateAvatar = async (): Promise<string> => {
    try {
      // Generate a random username for the avatar
      const randomUsername = Math.random().toString(36).substring(2, 15);
      const avatarUrl = `https://avatar-placeholder.iran.liara.run/document?username=${randomUsername}`;
      return avatarUrl;
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Fallback to a default avatar URL
      return `https://avatar-placeholder.iran.liara.run/document?username=user`;
    }
  };

  // Ensure a profile row exists for the authenticated user
  const ensureProfile = async (u: User) => {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', u.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking profile:', checkError);
        return;
      }

      if (!existing) {
        const meta = (u as any).user_metadata || {};
        const avatarUrl = await generateAvatar();
        
        const { error: insertError } = await supabase.from('profiles').insert({
          user_id: u.id,
          email: u.email,
          first_name: meta.first_name ?? null,
          last_name: meta.last_name ?? null,
          city: meta.city ?? null,
          phone_number: meta.phone_number ?? null,
          avatar_url: avatarUrl,
        });
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (e) {
      console.error('Unexpected error ensuring profile:', e);
    }
  };

  // When the auth user is available, ensure their profile exists
  useEffect(() => {
    if (!loading && user) {
      setTimeout(() => ensureProfile(user), 0);
    }
  }, [user, loading]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, city: string, phoneNumber: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            city,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
