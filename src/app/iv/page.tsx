import { SectionTitle } from '@/components/common/section-title';
import { IvCalculatorForm } from '@/components/iv/iv-calculator-form';
import { IvResultCard } from '@/components/iv/iv-result-card';

export default function IvPage() {
  return (
    <section className="space-y-3">
      <SectionTitle title="IV 계산기" subtitle="입력/결과 skeleton" />
      <IvCalculatorForm />
      <IvResultCard />
    </section>
  );
}
