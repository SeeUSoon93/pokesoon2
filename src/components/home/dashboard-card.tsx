import { Card } from '@/components/common/card';

export function DashboardCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-slate-600">{description}</p>
    </Card>
  );
}
