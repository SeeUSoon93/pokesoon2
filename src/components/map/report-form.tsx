'use client';

import { Button } from '@/components/common/button';
import { useAuth } from '@/hooks/use-auth';

export function ReportForm() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold">후기 작성</p>
      <p className="mb-3 text-xs text-slate-600">
        {isLoggedIn ? '로그인 사용자 작성 폼 placeholder' : '로그인 후 작성 가능'}
      </p>
      <Button disabled={!isLoggedIn}>후기 등록</Button>
    </div>
  );
}
