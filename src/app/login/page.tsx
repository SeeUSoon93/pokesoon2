import { AdaptiveBoard } from '@/components/common/adaptive-board';
import { SectionTitle } from '@/components/common/section-title';
import { LoginForm } from '@/components/auth/login-form';
import { ui } from '@/lib/ui';

const layouts = [
  {
    id: 'login',
    title: '로그인',
    caption: 'Firebase Auth',
    col: 0,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
  {
    id: 'policy',
    title: '권한',
    caption: 'MVP 접근 정책',
    col: 6,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
];

export default function LoginPage() {
  return (
    <section className={ui.section}>
      <SectionTitle title="로그인" subtitle="Firebase Authentication으로 후기 작성 권한을 연결합니다." />
      <AdaptiveBoard layouts={layouts} storageKey="board-login">
        <LoginForm />
        <div className="card-stack">
          <span className={ui.badge}>읽기 가능</span>
          <p className="muted-copy">비로그인 상태에서도 이벤트, 지도, 후기, IV 계산기는 볼 수 있습니다.</p>
          <span className={ui.badgeWarm}>로그인 필요</span>
          <p className="muted-copy">바이옴 후기는 Firebase 로그인 사용자만 작성하도록 연결합니다.</p>
        </div>
      </AdaptiveBoard>
    </section>
  );
}
