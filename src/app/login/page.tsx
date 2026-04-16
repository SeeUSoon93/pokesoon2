import { SectionTitle } from '@/components/common/section-title';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <section className="space-y-3">
      <SectionTitle title="로그인" subtitle="Firebase Authentication 연동 준비" />
      <LoginForm />
    </section>
  );
}
