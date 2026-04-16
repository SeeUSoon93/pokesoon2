import { SectionTitle } from '@/components/common/section-title';
import { EventCalendar } from '@/components/events/event-calendar';
import { EventList } from '@/components/events/event-list';
import { getEvents } from '@/features/events/queries';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="space-y-4">
      <SectionTitle title="이벤트" subtitle="이벤트 리스트/캘린더 구조" />
      <EventCalendar />
      <EventList events={events} />
    </section>
  );
}
