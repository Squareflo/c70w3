// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // initial load
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
      if (error) {
        console.error("getSession error:", error);
      }
    })();

    // subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        // if your app uses hard links, redirect:
        // window.location.href = "/sign-in";
      },
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
