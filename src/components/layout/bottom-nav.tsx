'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { useBottomNav } from '@/hooks/use-bottom-nav';
import { useAuth } from '@/hooks/use-auth';

export function BottomNav() {
  const { isActive } = useBottomNav();
  const { isLoggedIn } = useAuth();
  const authItem = isLoggedIn
    ? { label: '마이', href: '/me' }
    : { label: '로그인', href: '/login' };

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {[...NAV_ITEMS, authItem].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-2 py-3 text-center text-xs ${
                isActive(item.href) ? 'font-bold text-slate-900' : 'text-slate-500'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
