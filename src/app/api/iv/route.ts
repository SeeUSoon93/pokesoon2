import { NextResponse } from 'next/server';
import { calculateIv } from '@/features/iv/calculator';
import { IvInput } from '@/types/iv';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<IvInput>;
  const input: IvInput = {
    cp: Number(body.cp ?? 0),
    hp: Number(body.hp ?? 0),
    level: Number(body.level ?? 0),
  };

  if (input.cp <= 0 || input.hp <= 0 || input.level <= 0) {
    return NextResponse.json(
      { message: 'cp, hp, level은 모두 0보다 커야 합니다.' },
      { status: 400 },
    );
  }

  const result = calculateIv(input);

  return NextResponse.json({
    input,
    result,
    message: 'iv calculation complete',
  });
}
