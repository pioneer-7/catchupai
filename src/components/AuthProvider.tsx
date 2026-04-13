'use client';

// 전역 인증 상태 + AuthModal 관리
// SSOT: specs/004-backend/auth-spec.md

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { AuthModal } from '@/components/AuthModal';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  requireAuth: (callback?: () => void) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requireAuth: () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const requireAuth = useCallback((callback?: () => void) => {
    if (user) {
      callback?.();
    } else {
      setPendingCallback(() => callback || null);
      setShowModal(true);
    }
  }, [user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }, [supabase.auth]);

  function handleAuthSuccess() {
    pendingCallback?.();
    setPendingCallback(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, requireAuth, signOut }}>
      {children}
      <AuthModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setPendingCallback(null); }}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}
