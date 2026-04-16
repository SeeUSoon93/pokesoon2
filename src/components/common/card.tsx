import { ReactNode } from 'react';
import { ui } from '@/lib/ui';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Card({ children, className, bodyClassName }: CardProps) {
  return (
    <div className={cn(ui.card, className)}>
      <div className={cn('ui-card__body', bodyClassName)}>{children}</div>
    </div>
  );
}
