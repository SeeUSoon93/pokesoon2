import { Card } from '@/components/common/card';

export function IvCalculatorForm() {
  return (
    <Card>
      <p className="mb-2 font-semibold">IV 입력</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <input className="rounded border p-2" placeholder="CP" />
        <input className="rounded border p-2" placeholder="HP" />
        <input className="rounded border p-2" placeholder="Lv" />
      </div>
    </Card>
  );
}
