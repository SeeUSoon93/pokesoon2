'use client';

import { EmptyState } from '@/components/common/empty-state';
import { EventItem } from '@/types/event';
import { formatEventDateRange, getEventStatus, getEventStatusLabel } from '@/features/events/presenter';
import { ui } from '@/lib/ui';

export function EventCalendar({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return <EmptyState title="조건에 맞는 일정이 없습니다" description="상태나 태그 필터를 다시 고르면 바로 보입니다." />;
  }

  return (
    <div className="card-stack">
      {events.map((event) => (
        <article key={event.id} className={`${ui.stat} event-calendar__item`}>
          <div className="inline-row">
            <span className={getEventStatus(event) === 'completed' ? ui.badge : ui.badgeWarm}>
              {getEventStatusLabel(getEventStatus(event))}
            </span>
            <span className={ui.badge}>{formatEventDateRange(event)}</span>
          </div>
          <strong>{event.title}</strong>
          <p className="muted-copy">{event.tags.join(' · ')}</p>
        </article>
      ))}
    </div>
  );
}
