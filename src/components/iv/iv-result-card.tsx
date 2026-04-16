import { ui } from '@/lib/ui';

const stats = [
  { label: '공격', value: 15 },
  { label: '방어', value: 14 },
  { label: 'HP', value: 13 },
];

export function IvResultCard() {
  return (
    <div className="card-stack">
      <div className="inline-row">
        <span className={ui.badgeWarm}>예시 결과</span>
        <span className={ui.badge}>93.3%</span>
      </div>
      <div className="inline-row">
        {stats.map((stat) => (
          <div key={stat.label} className={ui.stat}>
            <span className="muted-copy">{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <p className="muted-copy">실제 계산 로직은 `features/iv/calculator.ts`에 붙일 수 있게 분리되어 있습니다.</p>
    </div>
  );
}
