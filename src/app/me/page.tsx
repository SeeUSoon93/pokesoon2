import { MeWorkspace } from '@/components/me/me-workspace';
import { SectionTitle } from '@/components/common/section-title';
import { ui } from '@/lib/ui';

export default function MePage() {
  return (
    <section className={ui.section}>
      <SectionTitle title="마이페이지" subtitle="내 정보와 내가 작성한 후기를 Firestore 문서 기준으로 확장합니다." />
      <MeWorkspace />
    </section>
  );
}
