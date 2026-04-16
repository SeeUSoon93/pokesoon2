import { Button } from '@/components/common/button';
import { ui } from '@/lib/ui';

export function IvCalculatorForm() {
  return (
    <form className="card-stack">
      <p className="muted-copy">정교한 계산식은 다음 단계에서 붙이고, 지금은 입력 구조를 잡아둡니다.</p>
      <div className="form-grid">
        <input className={ui.input} placeholder="CP" inputMode="numeric" />
        <input className={ui.input} placeholder="HP" inputMode="numeric" />
        <input className={ui.input} placeholder="Lv" inputMode="decimal" />
      </div>
      <Button type="button">계산하기</Button>
    </form>
  );
}
