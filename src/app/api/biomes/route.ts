import { NextResponse } from 'next/server';
import { getBiomes } from '@/features/biomes/queries';
import { requireAdmin } from '@/lib/api-auth';
import { FIRESTORE_COLLECTIONS, createFirestoreDocument } from '@/lib/firestore';

function parseBiomeBody(body: Record<string, unknown>) {
  const now = new Date().toISOString();
  const center = body.center as { lat?: unknown; lng?: unknown } | undefined;

  return {
    name: String(body.name ?? ''),
    biomeType: String(body.biomeType ?? ''),
    center:
      center && center.lat !== undefined && center.lng !== undefined
        ? {
            lat: Number(center.lat),
            lng: Number(center.lng),
          }
        : null,
    predictedPokemon: Array.isArray(body.predictedPokemon)
      ? body.predictedPokemon.map(String)
      : [],
    confidence: Number(body.confidence ?? 0),
    createdAt: now,
    updatedAt: now,
  };
}

export async function GET() {
  const items = await getBiomes();

  return NextResponse.json({ items, source: 'firestore-or-demo' });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const item = await createFirestoreDocument(
    FIRESTORE_COLLECTIONS.biomeRegions,
    parseBiomeBody(body),
    typeof body.id === 'string' && body.id ? body.id : undefined,
  );

  return NextResponse.json({ item, source: 'firestore' }, { status: 201 });
}
