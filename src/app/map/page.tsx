import { SectionTitle } from '@/components/common/section-title';
import { MapWorkspace } from '@/components/map/map-workspace';
import { getBiomes } from '@/features/biomes/queries';
import { getReports } from '@/features/reports/queries';
import { ui } from '@/lib/ui';

export default async function MapPage() {
  const [biomes, reports] = await Promise.all([getBiomes(), getReports()]);

  return (
    <section className={ui.section}>
      <SectionTitle
        title="바이옴 지도"
        subtitle="모바일에서는 바텀시트처럼 쌓이고, 넓은 화면에서는 패널 위치와 크기를 조절합니다."
      />
      <MapWorkspace initialBiomes={biomes} initialReports={reports} />
    </section>
  );
}
