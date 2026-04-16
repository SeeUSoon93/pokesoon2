'use client';

import { Button } from '@/components/common/button';
import { useAuth } from '@/hooks/use-auth';
import { ui } from '@/lib/ui';

export function LoginForm() {
  const { email, isAdmin, isLoading, isLoggedIn, loginWithGoogle, logout, userName } = useAuth();

  return (
    <div className="card-stack">
      <span className={isAdmin ? ui.badgeWarm : ui.badge}>Firebase Auth</span>
      <p className="adaptive-panel__title">
        {isLoggedIn ? userName ?? email ?? '로그인됨' : 'Google 로그인'}
      </p>
      <p className="muted-copy">
        {isAdmin
          ? '관리자 계정입니다. 추가, 수정, 삭제 액션이 표시됩니다.'
          : '일반 사용자는 조회와 후기 작성 권한을 사용합니다.'}
      </p>
      {isLoggedIn ? (
        <Button type="button" onClick={logout}>
          로그아웃
        </Button>
      ) : (
        <Button type="button" disabled={isLoading} onClick={loginWithGoogle}>
          Google로 로그인
        </Button>
      )}
    </div>
  );
}
