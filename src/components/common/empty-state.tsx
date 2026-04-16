import { ui } from '@/lib/ui';
import { cn } from '@/lib/utils';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className={cn(ui.cardMuted, 'ui-card__body')}>
      <p className="adaptive-panel__title">{title}</p>
      <p className="muted-copy">{description}</p>
    </div>
  );
}
