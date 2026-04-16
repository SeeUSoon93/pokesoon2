import { ReactNode } from 'react';
import { Header } from './header';
import { BottomNav } from './bottom-nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-20">
      <Header />
      <main className="space-y-4 p-4">{children}</main>
      <BottomNav />
    </div>
  );
}
