'use client';

import { startTransition, type FormEvent, useState } from 'react';
import { Button } from '@/components/common/button';
import { useAuth } from '@/hooks/use-auth';
import { ui } from '@/lib/ui';
import { BiomeReport } from '@/types/report';

type ReportFormProps = {
  regionId?: string;
  regionName?: string;
  onCreated?: (report: BiomeReport) => void;
};

export function ReportForm({ onCreated, regionId, regionName }: ReportFormProps) {
  const { getIdToken, isLoggedIn } = useAuth();
  const [observedPokemon, setObservedPokemon] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState('4');
  const [visitedAt, setVisitedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!regionId) {
      setStatus('먼저 지역을 선택해주세요.');
      return;
    }

    const token = await getIdToken();
    if (!token) {
      setStatus('로그인 정보를 가져오지 못했습니다.');
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const normalizedVisitedAt = new Date(visitedAt);
    if (Number.isNaN(normalizedVisitedAt.getTime())) {
      setIsSubmitting(false);
      setStatus('방문 시간을 올바르게 입력해주세요.');
      return;
    }

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        regionId,
        observedPokemon,
        note,
        rating: Number(rating),
        visitedAt: normalizedVisitedAt.toISOString(),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus(String(payload.message ?? '후기 저장에 실패했습니다.'));
      return;
    }

    setObservedPokemon('');
    setNote('');
    setRating('4');
    setVisitedAt(new Date().toISOString().slice(0, 16));
    setStatus('후기를 저장했습니다.');
    if (payload.item) {
      startTransition(() => onCreated?.(payload.item as BiomeReport));
    }
  }

  return (
    <form className="card-stack" onSubmit={handleSubmit}>
      {regionName ? <span className={ui.badge}>{regionName}</span> : null}
      <p className="muted-copy">
        {isLoggedIn
          ? '관측한 포켓몬과 메모를 남길 수 있습니다.'
          : '후기 작성은 로그인 후 가능합니다.'}
      </p>
      <input
        className={ui.input}
        placeholder="관측 포켓몬, 쉼표로 구분"
        disabled={!isLoggedIn || !regionId || isSubmitting}
        value={observedPokemon}
        onChange={(event) => setObservedPokemon(event.target.value)}
      />
      <textarea
        className={ui.input}
        placeholder="짧은 메모"
        disabled={!isLoggedIn || !regionId || isSubmitting}
        rows={3}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <div className="form-grid form-grid--report">
        <select
          className={ui.input}
          disabled={!isLoggedIn || !regionId || isSubmitting}
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          <option value="5">5점</option>
          <option value="4">4점</option>
          <option value="3">3점</option>
          <option value="2">2점</option>
          <option value="1">1점</option>
        </select>
        <input
          className={ui.input}
          type="datetime-local"
          disabled={!isLoggedIn || !regionId || isSubmitting}
          value={visitedAt}
          onChange={(event) => setVisitedAt(event.target.value)}
        />
      </div>
      {status ? <p className="muted-copy">{status}</p> : null}
      <Button disabled={!isLoggedIn || !regionId || isSubmitting} type="submit">
        {isSubmitting ? '저장 중...' : '후기 등록'}
      </Button>
    </form>
  );
}
