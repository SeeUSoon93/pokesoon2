import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="rounded-xl bg-white p-4 shadow-sm">{children}</div>;
}
