'use client';

import { useMemo, useState } from 'react';
import { AdaptiveBoard, type AdaptiveBoardLayout } from '@/components/common/adaptive-board';
import { EmptyState } from '@/components/common/empty-state';
import {
  EventStatus,
  formatEventDateRange,
  getEventStatus,
  getEventStatusLabel,
  getEventStatusSummary,
  getEventTagOptions,
  sortEventsByStart,
} from '@/features/events/presenter';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui';
import { EventItem } from '@/types/event';
import { EventCalendar } from './event-calendar';
import { EventList } from './event-list';

const layouts: AdaptiveBoardLayout[] = [
  {
    id: 'spotlight',
    title: '이벤트 브리핑',
    caption: '다음 우선순위',
    col: 0,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'filters',
    title: '필터',
    caption: '상태와 태그',
    col: 4,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'timeline',
    title: '타임라인',
    caption: '짧은 일정 보기',
    col: 8,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'list',
    title: '전체 목록',
    caption: '상세 확인용',
    col: 0,
    row: 3,
    colSpan: 12,
    rowSpan: 4,
  },
];

const STATUS_FILTERS: Array<{ label: string; value: 'all' | EventStatus }> = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'live' },
  { label: '예정', value: 'upcoming' },
  { label: '종료', value: 'completed' },
];

type EventsWorkspaceProps = {
  events: EventItem[];
};

export function EventsWorkspace({ events }: EventsWorkspaceProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const sortedEvents = useMemo(() => sortEventsByStart(events), [events]);
  const tagOptions = useMemo(() => getEventTagOptions(sortedEvents), [sortedEvents]);
  const filteredEvents = useMemo(
    () =>
      sortedEvents.filter((event) => {
        const statusMatches = statusFilter === 'all' ? true : getEventStatus(event) === statusFilter;
        const tagMatches = tagFilter === 'all' ? true : event.tags.includes(tagFilter);

        return statusMatches && tagMatches;
      }),
    [sortedEvents, statusFilter, tagFilter],
  );

  const liveCount = sortedEvents.filter((event) => getEventStatus(event) === 'live').length;
  const upcomingCount = sortedEvents.filter((event) => getEventStatus(event) === 'upcoming').length;
  const focusEvent =
    filteredEvents.find((event) => getEventStatus(event) === 'live') ??
    filteredEvents.find((event) => getEventStatus(event) === 'upcoming') ??
    filteredEvents[0];

  return (
    <AdaptiveBoard layouts={layouts} storageKey="board-events">
      {focusEvent ? (
        <div className="card-stack">
          <div className="inline-row">
            <span
              className={getEventStatus(focusEvent) === 'completed' ? ui.badge : ui.badgeWarm}
            >
              {getEventStatusLabel(getEventStatus(focusEvent))}
            </span>
            <span className={ui.badge}>{formatEventDateRange(focusEvent)}</span>
          </div>
          <h3 className="adaptive-panel__title">{focusEvent.title}</h3>
          <p className="muted-copy">{focusEvent.description}</p>
          <p className="muted-copy">{getEventStatusSummary(focusEvent)}</p>
          <div className="event-stats">
            <div className={ui.stat}>
              <span className="muted-copy">진행 중</span>
              <strong>{liveCount}</strong>
            </div>
            <div className={ui.stat}>
              <span className="muted-copy">예정</span>
              <strong>{upcomingCount}</strong>
            </div>
            <div className={ui.stat}>
              <span className="muted-copy">필터 결과</span>
              <strong>{filteredEvents.length}</strong>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState title="이벤트가 없습니다" description="이벤트를 추가하면 여기서 바로 분류해 볼 수 있습니다." />
      )}

      <div className="card-stack">
        <div className="card-stack">
          <span className="muted-copy">상태</span>
          <div className="chip-row">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={cn(
                  'chip-button',
                  statusFilter === filter.value && 'chip-button--active',
                )}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-stack">
          <span className="muted-copy">태그</span>
          <div className="chip-row">
            <button
              type="button"
              className={cn('chip-button', tagFilter === 'all' && 'chip-button--active')}
              onClick={() => setTagFilter('all')}
            >
              전체
            </button>
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={cn('chip-button', tagFilter === tag && 'chip-button--active')}
                onClick={() => setTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <EventCalendar events={filteredEvents} />
      <EventList events={filteredEvents} />
    </AdaptiveBoard>
  );
}
