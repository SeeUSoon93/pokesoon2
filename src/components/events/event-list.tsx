import { EventItem } from '@/types/event';
import { EventCard } from './event-card';

export function EventList({ events }: { events: EventItem[] }) {
  return (
    <div className="space-y-2">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
