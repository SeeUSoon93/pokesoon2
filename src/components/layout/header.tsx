import { APP_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <h1 className="text-base font-bold">{APP_NAME}</h1>
    </header>
  );
}
