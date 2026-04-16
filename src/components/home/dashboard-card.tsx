import { Card } from '@/components/common/card';

export function DashboardCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <p className="adaptive-panel__title">{title}</p>
      <p className="muted-copy">{description}</p>
    </Card>
  );
}
