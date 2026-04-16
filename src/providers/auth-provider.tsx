'use client';

import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { isAdminUid } from '@/lib/admin';
import { firebaseAuth } from '@/lib/firebase/client';

type AuthValue = {
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  uid?: string;
  email?: string | null;
  userName?: string | null;
  photoURL?: string | null;
  getIdToken: () => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthValue>({
  isLoading: true,
  isLoggedIn: false,
  isAdmin: false,
  getIdToken: async () => null,
  loginWithGoogle: async () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState<string>();
  const [email, setEmail] = useState<string | null>();
  const [userName, setUserName] = useState<string | null>();
  const [photoURL, setPhotoURL] = useState<string | null>();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      setUid(user?.uid);
      setEmail(user?.email);
      setUserName(user?.displayName);
      setPhotoURL(user?.photoURL);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    async function syncUser() {
      const user = firebaseAuth.currentUser;
      if (!user) return;

      try {
        const idToken = await user.getIdToken();
        await fetch('/api/users/me', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      } catch {
        return;
      }
    }

    syncUser();
  }, [uid]);

  const value = useMemo<AuthValue>(
    () => ({
      isLoading,
      isLoggedIn: Boolean(uid),
      isAdmin: isAdminUid(uid),
      uid,
      email,
      userName,
      photoURL,
      getIdToken: async () => firebaseAuth.currentUser?.getIdToken() ?? null,
      loginWithGoogle: async () => {
        await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      },
      logout: async () => {
        await signOut(firebaseAuth);
      },
    }),
    [email, isLoading, photoURL, uid, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
