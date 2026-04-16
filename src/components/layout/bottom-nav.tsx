'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { useBottomNav } from '@/hooks/use-bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { isActive } = useBottomNav();
  const { isLoggedIn } = useAuth();
  const authItem = isLoggedIn
    ? { label: '마이', href: '/me' }
    : { label: '로그인', href: '/login' };

  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      <div className="bottom-nav__list">
        {[...NAV_ITEMS, authItem].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('bottom-nav__link', isActive(item.href) && 'bottom-nav__link--active')}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
