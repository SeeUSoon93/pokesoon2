'use client';

import { useEffect, useState } from 'react';
import { AdaptiveBoard, type AdaptiveBoardLayout } from '@/components/common/adaptive-board';
import { ReportList } from '@/components/map/report-list';
import { useAuth } from '@/hooks/use-auth';
import { BiomeRegion } from '@/types/biome';
import { BiomeReport } from '@/types/report';
import { AppUser } from '@/types/user';
import { ui } from '@/lib/ui';

const layouts: AdaptiveBoardLayout[] = [
  {
    id: 'profile',
    title: '내 정보',
    caption: 'Firebase user',
    col: 0,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
  {
    id: 'reports',
    title: '내 후기',
    caption: 'biome_reports',
    col: 6,
    row: 0,
    colSpan: 6,
    rowSpan: 3,
  },
];

export function MeWorkspace() {
  const { email, getIdToken, isAdmin, isLoading, isLoggedIn, photoURL, uid, userName } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [reports, setReports] = useState<BiomeReport[]>([]);
  const [regionNames, setRegionNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!uid) {
        setProfile(null);
        setReports([]);
        setRegionNames({});
        setError(null);
        return;
      }

      const token = await getIdToken();
      if (!token) {
        setError('토큰을 가져오지 못했습니다.');
        return;
      }

      const [profileResponse, reportResponse, biomeResponse] = await Promise.all([
        fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`/api/reports?userUid=${encodeURIComponent(uid)}`),
        fetch('/api/biomes'),
      ]);

      const profilePayload = await profileResponse.json().catch(() => ({}));
      const reportPayload = await reportResponse.json().catch(() => ({}));
      const biomePayload = await biomeResponse.json().catch(() => ({}));

      if (!profileResponse.ok) {
        setError(String(profilePayload.message ?? '내 정보를 불러오지 못했습니다.'));
        return;
      }

      setProfile((profilePayload.item as AppUser | undefined) ?? null);
      setReports(Array.isArray(reportPayload.items) ? (reportPayload.items as BiomeReport[]) : []);
      setRegionNames(
        Array.isArray(biomePayload.items)
          ? Object.fromEntries(
              (biomePayload.items as BiomeRegion[]).map((biome) => [biome.id, biome.name]),
            )
          : {},
      );
      setError(null);
    }

    load();
  }, [getIdToken, uid]);

  if (!isLoggedIn && !isLoading) {
    return <p className="muted-copy">로그인하면 내 정보와 내가 쓴 후기를 볼 수 있습니다.</p>;
  }

  return (
    <AdaptiveBoard layouts={layouts} storageKey="board-me">
      <div className="card-stack">
        <span className={isAdmin ? ui.badgeWarm : ui.badge}>{isAdmin ? '관리자' : '사용자'}</span>
        <p className="adaptive-panel__title">{profile?.name ?? userName ?? '이름 없음'}</p>
        <p className="muted-copy">{profile?.email ?? email ?? '이메일 없음'}</p>
        <p className="muted-copy">uid: {profile?.uid ?? uid ?? '없음'}</p>
        {photoURL ? <p className="muted-copy">프로필 이미지 연결됨</p> : null}
        {error ? <p className="muted-copy">{error}</p> : null}
      </div>
      <div className="card-stack">
        <ReportList
          reports={reports}
          emptyTitle="아직 작성한 후기가 없습니다"
          emptyDescription="지도 화면에서 후기를 남기면 마이페이지에서도 바로 이어집니다."
          onUpdated={(updatedReport) =>
            setReports((currentReports) =>
              currentReports.map((report) =>
                report.id === updatedReport.id ? { ...report, ...updatedReport } : report,
              ),
            )
          }
          onDeleted={(deletedId) =>
            setReports((currentReports) => currentReports.filter((report) => report.id !== deletedId))
          }
          regionNames={regionNames}
        />
      </div>
    </AdaptiveBoard>
  );
}
