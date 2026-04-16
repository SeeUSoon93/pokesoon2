'use client';

import { usePathname } from 'next/navigation';

export function useBottomNav() {
  const pathname = usePathname();

  return {
    pathname,
    isActive: (href: string) => pathname === href,
  };
}
