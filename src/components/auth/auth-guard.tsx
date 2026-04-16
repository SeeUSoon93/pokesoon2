'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { isLoggedIn } = useAuth();

  return <>{isLoggedIn ? children : fallback}</>;
}
