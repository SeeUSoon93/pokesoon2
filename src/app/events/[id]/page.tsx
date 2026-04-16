import { Card } from '@/components/common/card';
import { getEvent } from '@/features/events/queries';
import {
  formatEventDateRange,
  getEventDurationLabel,
  getEventStatus,
  getEventStatusLabel,
  getEventStatusSummary,
} from '@/features/events/presenter';
import { ui } from '@/lib/ui';

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <Card>
        <p className="adaptive-panel__title">이벤트를 찾지 못했습니다</p>
        <p className="muted-copy">Firestore 문서 또는 더미 데이터에 없는 id입니다.</p>
      </Card>
    );
  }

  return (
    <section className={ui.section}>
      <Card>
        <div className="inline-row">
          <span className={getEventStatus(event) === 'completed' ? ui.badge : ui.badgeWarm}>
            {getEventStatusLabel(getEventStatus(event))}
          </span>
          <span className={ui.badge}>{formatEventDateRange(event)}</span>
        </div>
        <h2 className="adaptive-panel__title">{event.title}</h2>
        <p className="muted-copy">{event.description}</p>
        <div className="event-stats">
          <div className={ui.stat}>
            <span className="muted-copy">진행 상태</span>
            <strong>{getEventStatusLabel(getEventStatus(event))}</strong>
          </div>
          <div className={ui.stat}>
            <span className="muted-copy">길이</span>
            <strong>{getEventDurationLabel(event)}</strong>
          </div>
          <div className={ui.stat}>
            <span className="muted-copy">메모</span>
            <strong>{getEventStatusSummary(event)}</strong>
          </div>
        </div>
        <div className="inline-row">
          {event.tags.map((tag) => (
            <span key={tag} className={ui.badgeWarm}>
              {tag}
            </span>
          ))}
        </div>
      </Card>
      <Card>
        <p className="adaptive-panel__title">현장 체크</p>
        <div className="card-stack">
          <p className="muted-copy">이벤트 시작 전에는 해당 시간대 바이옴 후기와 최근 관측 메모를 먼저 확인합니다.</p>
          <p className="muted-copy">종료된 일정도 태그와 설명을 기준으로 다음 이벤트 준비 카드처럼 참고할 수 있습니다.</p>
        </div>
      </Card>
    </section>
  );
}
