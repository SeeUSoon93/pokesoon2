import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ items: [], message: 'events list skeleton' });
}
