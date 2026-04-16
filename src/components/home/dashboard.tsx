import { AdaptiveBoard } from '@/components/common/adaptive-board';
import { SectionTitle } from '@/components/common/section-title';
import { getBiomes } from '@/features/biomes/queries';
import { getEvents } from '@/features/events/queries';
import { getReports } from '@/features/reports/queries';
import { ui } from '@/lib/ui';
import { QuickLinks } from './quick-links';

const layouts = [
  {
    id: 'today',
    title: '오늘의 동선',
    caption: '이벤트와 지도 우선순위',
    col: 0,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'events',
    title: '다가오는 이벤트',
    caption: '짧게 확인하는 일정',
    col: 4,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'biomes',
    title: '바이옴 신호',
    caption: '최근 관측 기반 힌트',
    col: 8,
    row: 0,
    colSpan: 4,
    rowSpan: 3,
  },
  {
    id: 'quick',
    title: '빠른 이동',
    caption: '자주 쓰는 화면',
    col: 0,
    row: 3,
    colSpan: 6,
    rowSpan: 3,
  },
  {
    id: 'reports',
    title: '최근 후기',
    caption: '지인 관측 메모',
    col: 6,
    row: 3,
    colSpan: 6,
    rowSpan: 3,
  },
];

export async function Dashboard() {
  const [events, biomes, reports] = await Promise.all([getEvents(), getBiomes(), getReports()]);
  const nextEvent = events[0];
  const topBiome = biomes[0];
  const recentReport = reports[0];

  return (
    <section className={ui.section}>
      <SectionTitle
        title="홈"
        subtitle="모바일에서는 앱처럼 빠르게 보고, 넓은 화면에서는 카드를 직접 배치합니다."
      />
      <AdaptiveBoard layouts={[...layouts]} storageKey="board-home">
        <div className="card-stack">
          <span className={ui.badge}>오늘 추천</span>
          <h3 className="adaptive-panel__title">
            {nextEvent ? `${nextEvent.title} 전후로 지도 먼저 확인` : '이벤트를 등록하면 추천 동선이 열립니다'}
          </h3>
          <p className="muted-copy">
            근처 바이옴과 최근 후기를 보고, 실제로 돌 동선을 먼저 잡는 흐름으로 둡니다.
          </p>
          <div className="inline-row">
            <div className={ui.stat}>
              <span className="muted-copy">후기</span>
              <strong>{reports.length}</strong>
            </div>
            <div className={ui.stat}>
              <span className="muted-copy">바이옴</span>
              <strong>{biomes.length}</strong>
            </div>
          </div>
        </div>

        <div className="card-stack">
          {events.map((event) => (
            <article key={event.id} className={ui.stat}>
              <strong>{event.title}</strong>
              <p className="muted-copy">{event.description}</p>
            </article>
          ))}
        </div>

        <div className="card-stack">
          {topBiome ? (
            <>
              <span className={ui.badgeWarm}>{Math.round(topBiome.confidence * 100)}% 신뢰도</span>
              <h3 className="adaptive-panel__title">{topBiome.name}</h3>
              <p className="muted-copy">{topBiome.predictedPokemon.join(', ')} 출현 가능성이 높습니다.</p>
            </>
          ) : (
            <p className="muted-copy">Firestore에 biome_regions 문서를 넣으면 여기에 표시됩니다.</p>
          )}
        </div>

        <QuickLinks />

        <div className="card-stack">
          {recentReport ? (
            <>
              <p className="muted-copy">{recentReport.note}</p>
              <div className="inline-row">
                {recentReport.observedPokemon.map((pokemon) => (
                  <span key={pokemon} className={ui.badge}>
                    {pokemon}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="muted-copy">아직 후기가 없습니다.</p>
          )}
        </div>
      </AdaptiveBoard>
    </section>
  );
}
