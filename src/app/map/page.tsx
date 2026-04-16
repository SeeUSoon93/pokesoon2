import { SectionTitle } from '@/components/common/section-title';
import { BiomeBottomSheet } from '@/components/map/biome-bottom-sheet';
import { BiomeMap } from '@/components/map/biome-map';
import { BiomeRegionCard } from '@/components/map/biome-region-card';
import { ReportForm } from '@/components/map/report-form';
import { ReportList } from '@/components/map/report-list';

export default function MapPage() {
  return (
    <section className="space-y-3">
      <SectionTitle title="바이옴 지도" subtitle="지도 + 패널 + 후기 구조" />
      <BiomeMap />
      <BiomeBottomSheet />
      <BiomeRegionCard />
      <ReportList />
      <ReportForm />
    </section>
  );
}
