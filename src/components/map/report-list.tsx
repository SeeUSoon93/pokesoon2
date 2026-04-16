'use client';

import { useState } from 'react';
import { Button } from '@/components/common/button';
import { EmptyState } from '@/components/common/empty-state';
import { useAuth } from '@/hooks/use-auth';
import { formatDateLabel } from '@/lib/utils';
import { ui } from '@/lib/ui';
import { BiomeReport } from '@/types/report';

type ReportListProps = {
  reports: BiomeReport[];
  emptyTitle?: string;
  emptyDescription?: string;
  onDeleted?: (id: string) => void;
  onUpdated?: (report: BiomeReport) => void;
  regionNames?: Record<string, string>;
};

function toPrettyJson(report: BiomeReport) {
  return JSON.stringify(
    {
      observedPokemon: report.observedPokemon,
      note: report.note,
      rating: report.rating,
      visitedAt: report.visitedAt,
    },
    null,
    2,
  );
}

export function ReportList({
  reports,
  emptyDescription = '첫 후기를 남기면 바로 여기에 쌓입니다.',
  emptyTitle = '아직 후기가 없습니다',
  onDeleted,
  onUpdated,
  regionNames,
}: ReportListProps) {
  const { getIdToken, isAdmin, uid } = useAuth();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function requestReportAction(
    method: 'PATCH' | 'DELETE',
    report: BiomeReport,
    body?: Record<string, unknown>,
  ) {
    const token = await getIdToken();
    if (!token) {
      setStatusMessage('로그인 정보를 확인하지 못했습니다.');
      return;
    }

    setPendingId(report.id);
    setStatusMessage(null);

    const response = await fetch(`/api/reports/${report.id}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));
    setPendingId(null);

    if (!response.ok) {
      setStatusMessage(String(payload.message ?? '후기 작업에 실패했습니다.'));
      return;
    }

    if (method === 'DELETE') {
      onDeleted?.(report.id);
      setStatusMessage('후기를 삭제했습니다.');
      return;
    }

    const patched = (payload.item ?? {}) as Partial<BiomeReport>;
    onUpdated?.({
      ...report,
      ...patched,
      id: report.id,
    });
    setStatusMessage('후기를 수정했습니다.');
  }

  async function handleUpdate(report: BiomeReport) {
    const input = window.prompt('후기 수정 JSON', toPrettyJson(report));
    if (!input) return;

    try {
      await requestReportAction('PATCH', report, JSON.parse(input) as Record<string, unknown>);
    } catch {
      setStatusMessage('JSON 형식이 올바르지 않습니다.');
    }
  }

  async function handleDelete(report: BiomeReport) {
    if (!window.confirm('이 후기를 삭제할까요?')) {
      return;
    }

    await requestReportAction('DELETE', report);
  }

  if (reports.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="card-stack">
      {statusMessage ? <p className="muted-copy">{statusMessage}</p> : null}
      {reports.map((report) => {
        const canManage = isAdmin || uid === report.userUid;

        return (
          <article key={report.id} className={ui.stat}>
            <div className="inline-row">
              <span className={ui.badge}>{formatDateLabel(report.visitedAt)}</span>
              <span className={ui.badgeWarm}>{report.rating}점</span>
              {regionNames?.[report.regionId] ? <span className={ui.badge}>{regionNames[report.regionId]}</span> : null}
            </div>
            <div className="inline-row">
              {report.observedPokemon.map((pokemon) => (
                <span key={`${report.id}-${pokemon}`} className={ui.badge}>
                  {pokemon}
                </span>
              ))}
            </div>
            <p className="muted-copy">{report.note}</p>
            {canManage ? (
              <div className="report-actions">
                <Button
                  type="button"
                  className="admin-actions__button ui-button--secondary"
                  disabled={pendingId === report.id}
                  onClick={() => handleUpdate(report)}
                >
                  수정
                </Button>
                <Button
                  type="button"
                  className="admin-actions__button ui-button--secondary"
                  disabled={pendingId === report.id}
                  onClick={() => handleDelete(report)}
                >
                  삭제
                </Button>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
