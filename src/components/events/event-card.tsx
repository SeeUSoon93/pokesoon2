'use client';

import Link from 'next/link';
import { AdminActions } from '@/components/common/admin-actions';
import { formatEventDateRange, getEventStatus, getEventStatusLabel } from '@/features/events/presenter';
import { EventItem } from '@/types/event';
import { ui } from '@/lib/ui';

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className={ui.stat}>
      <Link href={`/events/${event.id}`} className="card-stack">
        <div className="inline-row">
          <span className={getEventStatus(event) === 'completed' ? ui.badge : ui.badgeWarm}>
            {getEventStatusLabel(getEventStatus(event))}
          </span>
          <span className={ui.badge}>{formatEventDateRange(event)}</span>
        </div>
        <strong>{event.title}</strong>
        <p className="muted-copy">{event.description}</p>
        <div className="inline-row">
          {event.tags.map((tag) => (
            <span key={tag} className={ui.badge}>
              {tag}
            </span>
          ))}
        </div>
      </Link>
      <AdminActions
        collectionLabel="이벤트"
        endpoint="/api/events"
        itemId={event.id}
        canCreate={false}
        updateTemplate={{
          title: event.title,
          slug: event.slug,
          description: event.description,
          startAt: event.startAt,
          endAt: event.endAt,
          tags: event.tags,
        }}
      />
    </article>
  );
}
