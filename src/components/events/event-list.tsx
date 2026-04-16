'use client';

import { AdminActions } from '@/components/common/admin-actions';
import { EmptyState } from '@/components/common/empty-state';
import { EventItem } from '@/types/event';
import { EventCard } from './event-card';

export function EventList({ events }: { events: EventItem[] }) {
  return (
    <div className="card-stack">
      <AdminActions
        collectionLabel="이벤트"
        endpoint="/api/events"
        canUpdate={false}
        canDelete={false}
        createTemplate={{
          id: 'event-id',
          title: '이벤트 이름',
          slug: 'event-slug',
          description: '설명',
          startAt: new Date().toISOString(),
          endAt: new Date().toISOString(),
          tags: ['태그'],
        }}
      />
      {events.length === 0 ? (
        <EmptyState title="보여줄 이벤트가 없습니다" description="필터를 풀거나 새 이벤트를 추가하면 바로 목록에 반영됩니다." />
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
}
