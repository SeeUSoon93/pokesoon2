import Link from 'next/link';
import { Card } from '@/components/common/card';

export function QuickLinks() {
  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold">바로가기</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Link href="/map" className="rounded-lg bg-slate-100 px-3 py-2">
          지도 보기
        </Link>
        <Link href="/iv" className="rounded-lg bg-slate-100 px-3 py-2">
          IV 계산기
        </Link>
      </div>
    </Card>
  );
}
