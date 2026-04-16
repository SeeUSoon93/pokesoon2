import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ item: { id: params.id }, message: 'event detail skeleton' });
}
