import { Button } from '@/components/common/button';

export function LoginForm() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-2 font-semibold">Firebase 로그인</p>
      <p className="mb-3 text-sm text-slate-600">인증 연동용 skeleton</p>
      <Button>Google로 로그인</Button>
    </div>
  );
}
