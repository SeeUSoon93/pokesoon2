import { NextResponse } from 'next/server';
import { getReport } from '@/features/reports/queries';
import { getRequestUser } from '@/lib/api-auth';
import { isAdminUid } from '@/lib/admin';
import { FIRESTORE_COLLECTIONS, deleteFirestoreDocument, updateFirestoreDocument } from '@/lib/firestore';

function parseObservedPokemon(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const item = await getReport(id);

  return NextResponse.json({ item, source: 'firestore-or-demo' }, { status: item ? 200 : 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  const currentReport = await getReport(id);
  const canEdit = isAdminUid(user.uid) || currentReport?.userUid === user.uid;

  if (!canEdit) {
    return NextResponse.json({ message: '수정 권한이 없습니다.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const observedPokemon = body.observedPokemon !== undefined ? parseObservedPokemon(body.observedPokemon) : undefined;
  const note = body.note !== undefined ? String(body.note).trim() : undefined;
  const rating = body.rating !== undefined ? Number(body.rating) : undefined;
  const visitedAt = body.visitedAt !== undefined ? String(body.visitedAt).trim() : undefined;

  if (observedPokemon && observedPokemon.length === 0) {
    return NextResponse.json({ message: '관측 포켓몬을 하나 이상 입력해주세요.' }, { status: 400 });
  }

  if (note !== undefined && !note) {
    return NextResponse.json({ message: '메모를 입력해주세요.' }, { status: 400 });
  }

  if (rating !== undefined && (!Number.isFinite(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ message: 'rating은 1부터 5 사이여야 합니다.' }, { status: 400 });
  }

  if (visitedAt !== undefined && Number.isNaN(new Date(visitedAt).getTime())) {
    return NextResponse.json({ message: 'visitedAt이 올바르지 않습니다.' }, { status: 400 });
  }

  const item = await updateFirestoreDocument(FIRESTORE_COLLECTIONS.biomeReports, id, {
    observedPokemon,
    note,
    rating,
    visitedAt,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ item, source: 'firestore' });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { id } = await params;
  const currentReport = await getReport(id);
  const canDelete = isAdminUid(user.uid) || currentReport?.userUid === user.uid;

  if (!canDelete) {
    return NextResponse.json({ message: '삭제 권한이 없습니다.' }, { status: 403 });
  }

  const item = await deleteFirestoreDocument(FIRESTORE_COLLECTIONS.biomeReports, id);

  return NextResponse.json({ item, source: 'firestore' });
}
