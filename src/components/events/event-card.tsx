import { Card } from '@/components/common/card';
import { EventItem } from '@/types/event';

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Card>
      <p className="font-semibold">{event.title}</p>
      <p className="text-sm text-slate-600">{event.description}</p>
    </Card>
  );
}
