import { EventItem } from '@/types/event';

export async function getEvents(): Promise<EventItem[]> {
  return [
    {
      _id: 'event-1',
      title: '커뮤니티 데이',
      slug: 'community-day',
      description: '이벤트 더미 설명',
      startAt: new Date().toISOString(),
      endAt: new Date().toISOString(),
      tags: ['community'],
    },
  ];
}
