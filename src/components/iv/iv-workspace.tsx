'use client';

import { FormEvent, useState } from 'react';
import { AdaptiveBoard, type AdaptiveBoardLayout } from '@/components/common/adaptive-board';
import { Button } from '@/components/common/button';
import { IvResult } from '@/types/iv';
import { ui } from '@/lib/ui';

const layouts: AdaptiveBoardLayout[] = [
  {
    id: 'input',
    title: 'IV 입력',
    caption: 'CP/HP/레벨',
    col: 0,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
  {
    id: 'result',
    title: '계산 결과',
    caption: '후보 개체값',
    col: 6,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
];

const emptyResult: IvResult = {
  attack: 0,
  defense: 0,
  stamina: 0,
  percent: 0,
};

export function IvWorkspace() {
  const [cp, setCp] = useState('');
  const [hp, setHp] = useState('');
  const [level, setLevel] = useState('');
  const [result, setResult] = useState<IvResult>(emptyResult);
  const [status, setStatus] = useState('값을 입력하고 계산을 눌러주세요.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch('/api/iv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cp: Number(cp),
        hp: Number(hp),
        level: Number(level),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus(String(payload.message ?? '계산에 실패했습니다.'));
      return;
    }

    setResult((payload.result as IvResult | undefined) ?? emptyResult);
    setStatus('계산 결과를 갱신했습니다.');
  }

  return (
    <AdaptiveBoard layouts={layouts} storageKey="board-iv">
      <form className="card-stack" onSubmit={handleSubmit}>
        <p className="muted-copy">지금은 간단 계산 로직이 연결되어 있고, 추후 정밀식으로 바꿀 수 있습니다.</p>
        <div className="form-grid">
          <input
            className={ui.input}
            placeholder="CP"
            inputMode="numeric"
            value={cp}
            onChange={(event) => setCp(event.target.value)}
          />
          <input
            className={ui.input}
            placeholder="HP"
            inputMode="numeric"
            value={hp}
            onChange={(event) => setHp(event.target.value)}
          />
          <input
            className={ui.input}
            placeholder="Lv"
            inputMode="decimal"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '계산 중...' : '계산하기'}
        </Button>
      </form>
      <div className="card-stack">
        <div className="inline-row">
          <span className={ui.badgeWarm}>예상 결과</span>
          <span className={ui.badge}>{result.percent}%</span>
        </div>
        <div className="inline-row">
          <div className={ui.stat}>
            <span className="muted-copy">공격</span>
            <strong>{result.attack}</strong>
          </div>
          <div className={ui.stat}>
            <span className="muted-copy">방어</span>
            <strong>{result.defense}</strong>
          </div>
          <div className={ui.stat}>
            <span className="muted-copy">HP</span>
            <strong>{result.stamina}</strong>
          </div>
        </div>
        <p className="muted-copy">{status}</p>
      </div>
    </AdaptiveBoard>
  );
}
