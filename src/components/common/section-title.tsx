import { ui } from '@/lib/ui';

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={ui.sectionTitle}>
      <h2>{title}</h2>
      {subtitle ? <p className={ui.sectionSubtitle}>{subtitle}</p> : null}
    </div>
  );
}
