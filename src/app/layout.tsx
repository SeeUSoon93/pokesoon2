import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata: Metadata = {
  title: 'PokeSoon',
  description: '포켓몬고 보조 웹앱 MVP 구조',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
