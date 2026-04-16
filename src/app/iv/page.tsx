import { SectionTitle } from '@/components/common/section-title';
import { IvWorkspace } from '@/components/iv/iv-workspace';
import { ui } from '@/lib/ui';

export default function IvPage() {
  return (
    <section className={ui.section}>
      <SectionTitle title="IV 계산기" subtitle="모바일에서는 입력 후 결과를 바로 보고, 넓은 화면에서는 카드 위치를 조절합니다." />
      <IvWorkspace />
    </section>
  );
}
