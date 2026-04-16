import { EventItem } from '@/types/event';

export type EventStatus = 'live' | 'upcoming' | 'completed';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function getEventBoundary(event: EventItem) {
  return {
    start: new Date(event.startAt),
    end: new Date(event.endAt),
  };
}

export function sortEventsByStart(events: EventItem[]) {
  return [...events].sort(
    (left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime(),
  );
}

export function getEventStatus(event: EventItem, now = Date.now()): EventStatus {
  const { end, start } = getEventBoundary(event);
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return 'upcoming';
  }

  if (startTime <= now && endTime >= now) {
    return 'live';
  }

  return startTime > now ? 'upcoming' : 'completed';
}

export function getEventStatusLabel(status: EventStatus) {
  if (status === 'live') return '진행 중';
  if (status === 'completed') return '종료';

  return '예정';
}

export function getEventStatusSummary(event: EventItem, now = Date.now()) {
  const { end, start } = getEventBoundary(event);
  const startTime = start.getTime();
  const endTime = end.getTime();
  const status = getEventStatus(event, now);

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return '일정 시간을 다시 확인해주세요.';
  }

  if (status === 'live') {
    const remainingMinutes = Math.max(0, Math.round((endTime - now) / 60000));

    if (remainingMinutes < 60) {
      return `${remainingMinutes}분 남았습니다.`;
    }

    return `${Math.ceil(remainingMinutes / 60)}시간 정도 남았습니다.`;
  }

  if (status === 'completed') {
    const diffDays = Math.max(1, Math.round((now - endTime) / 86400000));

    return `${diffDays}일 전에 종료됐습니다.`;
  }

  const diffHours = Math.max(1, Math.round((startTime - now) / 3600000));

  if (diffHours < 24) {
    return `${diffHours}시간 뒤에 시작합니다.`;
  }

  return `${Math.ceil(diffHours / 24)}일 뒤에 시작합니다.`;
}

export function formatEventDateRange(event: EventItem) {
  const { end, start } = getEventBoundary(event);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '일정 미정';
  }

  const isSameDate = start.toDateString() === end.toDateString();

  if (isSameDate) {
    return `${DATE_FORMATTER.format(start)} ${TIME_FORMATTER.format(start)} - ${TIME_FORMATTER.format(end)}`;
  }

  return `${DATE_TIME_FORMATTER.format(start)} - ${DATE_TIME_FORMATTER.format(end)}`;
}

export function getEventDurationLabel(event: EventItem) {
  const { end, start } = getEventBoundary(event);
  const durationMs = end.getTime() - start.getTime();

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return '시간 미정';
  }

  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}

export function getEventTagOptions(events: EventItem[]) {
  return [...new Set(events.flatMap((event) => event.tags).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, 'ko-KR'),
  );
}
