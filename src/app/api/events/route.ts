import { NextResponse } from 'next/server';
import { getEvents } from '@/features/events/queries';
import { requireAdmin } from '@/lib/api-auth';
import { FIRESTORE_COLLECTIONS, createFirestoreDocument } from '@/lib/firestore';

function parseEventBody(body: Record<string, unknown>) {
  const now = new Date().toISOString();
  const title = String(body.title ?? '');

  return {
    title,
    slug: String(body.slug ?? title.toLowerCase().replace(/\s+/g, '-')),
    description: String(body.description ?? ''),
    startAt: String(body.startAt ?? now),
    endAt: String(body.endAt ?? now),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function GET() {
  const items = await getEvents();

  return NextResponse.json({ items, source: 'firestore-or-demo' });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const item = await createFirestoreDocument(
    FIRESTORE_COLLECTIONS.events,
    parseEventBody(body),
    typeof body.id === 'string' && body.id ? body.id : undefined,
  );

  return NextResponse.json({ item, source: 'firestore' }, { status: 201 });
}
