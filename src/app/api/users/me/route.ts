import { NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/api-auth';
import { isAdminUid } from '@/lib/admin';
import { FIRESTORE_COLLECTIONS, createFirestoreDocument, readFirestoreDocument } from '@/lib/firestore';
import { AppUser } from '@/types/user';

export async function GET(request: Request) {
  const user = await getRequestUser(request);

  if (!user) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const item =
    (await readFirestoreDocument<AppUser & { id: string }>(FIRESTORE_COLLECTIONS.users, user.uid)) ??
    ({
      uid: user.uid,
      email: user.email ?? null,
      name: user.name ?? null,
      image: user.picture ?? null,
      provider: user.firebase.sign_in_provider,
      isAdmin: isAdminUid(user.uid),
    } as const);

  return NextResponse.json({ item, source: 'firestore-or-token' });
}

export async function POST(request: Request) {
  const user = await getRequestUser(request);

  if (!user) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const existingUser = await readFirestoreDocument<AppUser & { id: string }>(
    FIRESTORE_COLLECTIONS.users,
    user.uid,
  );
  const now = new Date().toISOString();
  const item = await createFirestoreDocument(
    FIRESTORE_COLLECTIONS.users,
    {
      uid: user.uid,
      email: user.email ?? null,
      name: user.name ?? null,
      image: user.picture ?? null,
      provider: user.firebase.sign_in_provider,
      isAdmin: isAdminUid(user.uid),
      updatedAt: now,
      createdAt: existingUser?.createdAt ?? now,
    },
    user.uid,
  );

  return NextResponse.json({ item, source: 'firestore' });
}
