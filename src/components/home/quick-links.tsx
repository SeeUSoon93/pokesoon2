import Link from 'next/link';
import { ui } from '@/lib/ui';

const links = [
  { href: '/map', label: '지도 보기', description: '바이옴과 후기 확인' },
  { href: '/iv', label: 'IV 계산기', description: '개체값 빠른 계산' },
  { href: '/events', label: '이벤트', description: '다가오는 일정' },
  { href: '/login', label: '로그인', description: '후기 작성 준비' },
];

export function QuickLinks() {
  return (
    <div className="card-stack">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={ui.stat}>
          <strong>{link.label}</strong>
          <span className="muted-copy">{link.description}</span>
        </Link>
      ))}
    </div>
  );
}
