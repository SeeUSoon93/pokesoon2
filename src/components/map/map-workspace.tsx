'use client';

import { startTransition, useState } from 'react';
import { AdaptiveBoard, type AdaptiveBoardLayout } from '@/components/common/adaptive-board';
import { BiomeBottomSheet } from '@/components/map/biome-bottom-sheet';
import { BiomeMap } from '@/components/map/biome-map';
import { BiomeRegionCard } from '@/components/map/biome-region-card';
import { ReportForm } from '@/components/map/report-form';
import { ReportList } from '@/components/map/report-list';
import { BiomeRegion } from '@/types/biome';
import { BiomeReport } from '@/types/report';

const layouts: AdaptiveBoardLayout[] = [
  {
    id: 'map',
    title: '바이옴 지도',
    caption: '지도 영역',
    col: 0,
    row: 0,
    colSpan: 7,
    rowSpan: 5,
    minColSpan: 4,
    minRowSpan: 3,
  },
  {
    id: 'panel',
    title: '지역 상세',
    caption: '선택 지역 요약',
    col: 7,
    row: 0,
    colSpan: 5,
    rowSpan: 2,
  },
  {
    id: 'biomes',
    title: '후보 바이옴',
    caption: '예상 포켓몬',
    col: 7,
    row: 2,
    colSpan: 5,
    rowSpan: 3,
  },
  {
    id: 'reports',
    title: '후기',
    caption: '실제 관측 기록',
    col: 0,
    row: 5,
    colSpan: 6,
    rowSpan: 3,
  },
  {
    id: 'write',
    title: '후기 작성',
    caption: '로그인 사용자 전용',
    col: 6,
    row: 5,
    colSpan: 6,
    rowSpan: 3,
  },
];

type MapWorkspaceProps = {
  initialBiomes: BiomeRegion[];
  initialReports: BiomeReport[];
};

export function MapWorkspace({ initialBiomes, initialReports }: MapWorkspaceProps) {
  const [selectedBiomeId, setSelectedBiomeId] = useState(initialBiomes[0]?.id);
  const [reports, setReports] = useState(initialReports);

  const selectedBiome = initialBiomes.find((biome) => biome.id === selectedBiomeId);
  const filteredReports = selectedBiome
    ? reports.filter((report) => report.regionId === selectedBiome.id)
    : reports;

  function handleCreatedReport(report: BiomeReport) {
    startTransition(() => {
      setReports((currentReports) => [report, ...currentReports.filter((item) => item.id !== report.id)]);
    });
  }

  function handleUpdatedReport(updatedReport: BiomeReport) {
    startTransition(() => {
      setReports((currentReports) =>
        currentReports.map((item) => (item.id === updatedReport.id ? { ...item, ...updatedReport } : item)),
      );
    });
  }

  function handleDeletedReport(id: string) {
    startTransition(() => {
      setReports((currentReports) => currentReports.filter((item) => item.id !== id));
    });
  }

  return (
    <AdaptiveBoard layouts={layouts} storageKey="board-map">
      <BiomeMap
        biomes={initialBiomes}
        selectedBiomeId={selectedBiomeId}
        onSelectBiome={setSelectedBiomeId}
      />
      <BiomeBottomSheet biome={selectedBiome} reportCount={filteredReports.length} />
      <BiomeRegionCard
        biomes={initialBiomes}
        selectedBiomeId={selectedBiomeId}
        onSelectBiome={setSelectedBiomeId}
      />
      <ReportList
        reports={filteredReports}
        onUpdated={handleUpdatedReport}
        onDeleted={handleDeletedReport}
      />
      <ReportForm
        regionId={selectedBiome?.id}
        regionName={selectedBiome?.name}
        onCreated={handleCreatedReport}
      />
    </AdaptiveBoard>
  );
}
