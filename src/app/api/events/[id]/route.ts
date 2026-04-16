import { NextResponse } from 'next/server';
import { getEvent } from '@/features/events/queries';
import { requireAdmin } from '@/lib/api-auth';
import { FIRESTORE_COLLECTIONS, deleteFirestoreDocument, updateFirestoreDocument } from '@/lib/firestore';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const item = await getEvent(id);

  return NextResponse.json({ item, source: 'firestore-or-demo' }, { status: item ? 200 : 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const item = await updateFirestoreDocument(FIRESTORE_COLLECTIONS.events, id, {
    ...body,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ item, source: 'firestore' });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const { id } = await params;
  const item = await deleteFirestoreDocument(FIRESTORE_COLLECTIONS.events, id);

  return NextResponse.json({ item, source: 'firestore' });
}
