import { NextResponse } from 'next/server';
import { getReports } from '@/features/reports/queries';
import { getRequestUser } from '@/lib/api-auth';
import { FIRESTORE_COLLECTIONS, createFirestoreDocument } from '@/lib/firestore';

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

  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const items = await getReports({
    regionId: searchParams.get('regionId') ?? undefined,
    userUid: searchParams.get('userUid') ?? undefined,
  });

  return NextResponse.json({ items, source: 'firestore-or-demo' });
}

export async function POST(request: Request) {
  const decodedToken = await getRequestUser(request);

  if (!decodedToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const observedPokemon = parseObservedPokemon(body.observedPokemon);
  const note = String(body.note ?? '').trim();
  const regionId = String(body.regionId ?? '').trim();
  const rating = Number(body.rating ?? 0);
  const visitedAt = String(body.visitedAt ?? '').trim();

  if (!regionId) {
    return NextResponse.json({ message: 'regionId가 필요합니다.' }, { status: 400 });
  }

  if (observedPokemon.length === 0) {
    return NextResponse.json({ message: '관측 포켓몬을 하나 이상 입력해주세요.' }, { status: 400 });
  }

  if (!note) {
    return NextResponse.json({ message: '메모를 입력해주세요.' }, { status: 400 });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'rating은 1부터 5 사이여야 합니다.' }, { status: 400 });
  }

  if (!visitedAt || Number.isNaN(new Date(visitedAt).getTime())) {
    return NextResponse.json({ message: 'visitedAt이 올바르지 않습니다.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const item = await createFirestoreDocument(FIRESTORE_COLLECTIONS.biomeReports, {
    regionId,
    userUid: decodedToken.uid,
    observedPokemon,
    note,
    rating,
    visitedAt,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ item, source: 'firestore-or-demo' }, { status: 201 });
}
