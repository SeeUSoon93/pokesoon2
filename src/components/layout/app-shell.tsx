import { ReactNode } from 'react';
import { ui } from '@/lib/ui';
import { BottomNav } from './bottom-nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={ui.appShell}>
      <main className={ui.appMain}>{children}</main>
      <BottomNav />
    </div>
  );
}
