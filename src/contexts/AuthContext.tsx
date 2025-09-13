import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, city: string, phoneNumber: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user profile data to Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        firstName,
        lastName,
        city,
        phoneNumber,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};