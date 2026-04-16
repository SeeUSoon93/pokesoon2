import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ui } from '@/lib/ui';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={cn(ui.button, className)} {...props}>
      {children}
    </button>
  );
}
