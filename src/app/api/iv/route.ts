import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    input: body,
    result: { attack: 0, defense: 0, stamina: 0, percent: 0 },
    message: 'iv calculate skeleton',
  });
}
