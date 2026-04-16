import { BiomeRegion } from '@/types/biome';
import { EventItem } from '@/types/event';
import { BiomeReport } from '@/types/report';

export const demoEvents: EventItem[] = [
  {
    id: 'event-community-day',
    title: '커뮤니티 데이',
    slug: 'community-day',
    description: '이번 주말 14시부터 17시까지 대량 발생과 보너스가 열립니다.',
    startAt: '2026-04-18T14:00:00+09:00',
    endAt: '2026-04-18T17:00:00+09:00',
    tags: ['대량발생', 'XP 보너스'],
  },
  {
    id: 'event-raid-hour',
    title: '레이드 아워',
    slug: 'raid-hour',
    description: '수요일 저녁 전설 레이드 동선을 미리 확인하세요.',
    startAt: '2026-04-22T18:00:00+09:00',
    endAt: '2026-04-22T19:00:00+09:00',
    tags: ['레이드', '저녁'],
  },
  {
    id: 'event-spotlight',
    title: '스포트라이트 아워',
    slug: 'spotlight-hour',
    description: '짧게 돌기 좋은 한 시간짜리 파밍 이벤트입니다.',
    startAt: '2026-04-21T18:00:00+09:00',
    endAt: '2026-04-21T19:00:00+09:00',
    tags: ['파밍', '별의모래'],
  },
];

export const demoBiomes: BiomeRegion[] = [
  {
    id: 'biome-hangang',
    name: '한강공원',
    center: { lat: 37.528, lng: 126.932 },
    biomeType: 'river',
    predictedPokemon: ['물짱이', '잉어킹', '고라파덕'],
    confidence: 0.78,
  },
  {
    id: 'biome-olympic',
    name: '올림픽공원',
    center: { lat: 37.521, lng: 127.122 },
    biomeType: 'park',
    predictedPokemon: ['이상해씨', '콩둘기', '도토링'],
    confidence: 0.66,
  },
  {
    id: 'biome-downtown',
    name: '강남역 일대',
    center: { lat: 37.498, lng: 127.027 },
    biomeType: 'urban',
    predictedPokemon: ['찌르꼬', '꼬렛', '코일'],
    confidence: 0.59,
  },
];

export const demoReports: BiomeReport[] = [
  {
    id: 'report-hangang-1',
    regionId: 'biome-hangang',
    userUid: 'demo-uid',
    observedPokemon: ['잉어킹', '고라파덕'],
    note: '강변 쪽 스폰이 훨씬 촘촘했습니다.',
    rating: 4,
    visitedAt: '2026-04-15T19:30:00+09:00',
  },
  {
    id: 'report-olympic-1',
    regionId: 'biome-olympic',
    userUid: 'demo-uid',
    observedPokemon: ['이상해씨', '도토링'],
    note: '산책로 기준으로 풀 타입이 자주 보였습니다.',
    rating: 5,
    visitedAt: '2026-04-14T16:10:00+09:00',
  },
];
