'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/common/card';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <Card>
        <p className="adaptive-panel__title">로그인이 필요합니다</p>
        <p className="muted-copy">후기 작성과 마이페이지 기능은 로그인 후 사용할 수 있습니다.</p>
      </Card>
    );
  }

  return children;
}
