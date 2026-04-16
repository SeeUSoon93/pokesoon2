import { SectionTitle } from '@/components/common/section-title';
import { EventsWorkspace } from '@/components/events/events-workspace';
import { getEvents } from '@/features/events/queries';
import { ui } from '@/lib/ui';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className={ui.section}>
      <SectionTitle title="이벤트" subtitle="예정된 이벤트를 카드로 확인하고 상세 화면으로 이동합니다." />
      <EventsWorkspace events={events} />
    </section>
  );
}
