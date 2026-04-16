import { Card } from '@/components/common/card';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <p className="font-semibold">이벤트 상세</p>
      <p className="text-sm text-slate-600">event id: {params.id}</p>
    </Card>
  );
}
