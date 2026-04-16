import { SectionTitle } from '@/components/common/section-title';
import { DashboardCard } from './dashboard-card';
import { QuickLinks } from './quick-links';

export function Dashboard() {
  return (
    <section className="space-y-3">
      <SectionTitle title="홈 대시보드" subtitle="MVP 구조용 placeholder" />
      <DashboardCard title="최근 이벤트" description="이벤트 요약 카드 영역" />
      <DashboardCard title="최근 후기" description="후기/안내 카드 영역" />
      <QuickLinks />
    </section>
  );
}
