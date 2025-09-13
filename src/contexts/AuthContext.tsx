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
  sendVerificationEmail: (email: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ error: Error | null }>;
  completeSignUp: (email: string, code: string) => Promise<{ error: Error | null }>;
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
        console.log('Auth state changed:', event, session);
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

  const sendVerificationEmail = async (email: string, firstName?: string, lastName?: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, firstName, lastName }
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { error: error as Error };
    }
  };

  const verifyEmailCode = async (email: string, code: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code }
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error verifying email code:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, city: string, phoneNumber: string) => {
    try {
      // First send verification email
      const { error: emailError } = await sendVerificationEmail(email, firstName, lastName);
      if (emailError) throw emailError;

      // Store user data temporarily (you might want to use localStorage or a more sophisticated approach)
      localStorage.setItem('pendingSignUp', JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        city,
        phoneNumber
      }));

      return { error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: error as Error };
    }
  };

  const completeSignUp = async (email: string, code: string) => {
    try {
      // Verify the email code first
      const { error: verifyError } = await verifyEmailCode(email, code);
      if (verifyError) throw verifyError;

      // Get stored user data
      const pendingData = localStorage.getItem('pendingSignUp');
      if (!pendingData) throw new Error('No pending signup data found');

      const userData = JSON.parse(pendingData);
      
      // Create the user account
      const { error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            city: userData.city,
            phone_number: userData.phoneNumber
          }
        }
      });

      if (signUpError) throw signUpError;

      // Clear pending data
      localStorage.removeItem('pendingSignUp');
      return { error: null };
    } catch (error) {
      console.error('Error completing sign up:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
    signOut,
    sendVerificationEmail,
    verifyEmailCode,
    completeSignUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};