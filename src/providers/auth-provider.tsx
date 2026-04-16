'use client';

import { createContext, ReactNode, useMemo } from 'react';

type AuthValue = {
  isLoggedIn: boolean;
  userName?: string;
};

export const AuthContext = createContext<AuthValue>({
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthValue>(() => ({ isLoggedIn: false }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
