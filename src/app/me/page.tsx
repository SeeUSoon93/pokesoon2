import { Card } from '@/components/common/card';
import { SectionTitle } from '@/components/common/section-title';

export default function MePage() {
  return (
    <section className="space-y-3">
      <SectionTitle title="마이페이지" subtitle="내 정보/내 후기 확장 구조" />
      <Card>
        <p className="font-semibold">사용자 정보 placeholder</p>
        <p className="text-sm text-slate-600">로그인 상태 기반으로 추후 확장</p>
      </Card>
    </section>
  );
}
