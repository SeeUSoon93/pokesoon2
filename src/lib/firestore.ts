import {
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  events: 'events',
  biomeRegions: 'biome_regions',
  biomeReports: 'biome_reports',
} as const;

type WithId = {
  id: string;
};

function normalizeFirestoreValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeFirestoreValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeFirestoreValue(nestedValue)]),
    );
  }

  return value;
}

function mapDocument<T extends WithId>(document: QueryDocumentSnapshot<DocumentData>): T {
  const data = normalizeFirestoreValue(document.data()) as Omit<T, 'id'>;

  return {
    id: document.id,
    ...data,
  } as T;
}

function stripUndefinedValues<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

export async function readFirestoreCollection<T extends WithId>(
  collectionName: string,
  fallbackItems: T[],
): Promise<T[]> {
  if (!isFirebaseAdminConfigured()) {
    return fallbackItems;
  }

  try {
    const snapshot = await getFirebaseAdminDb().collection(collectionName).get();
    const items = snapshot.docs.map((document) => mapDocument<T>(document));

    return items.length > 0 ? items : fallbackItems;
  } catch {
    return fallbackItems;
  }
}

export async function readFirestoreDocument<T extends WithId>(
  collectionName: string,
  id: string,
  fallbackItem?: T,
): Promise<T | null> {
  if (!isFirebaseAdminConfigured()) {
    return fallbackItem ?? null;
  }

  try {
    const snapshot = await getFirebaseAdminDb().collection(collectionName).doc(id).get();

    if (!snapshot.exists) {
      return fallbackItem ?? null;
    }

    return {
      id: snapshot.id,
      ...(normalizeFirestoreValue(snapshot.data() ?? {}) as Omit<T, 'id'>),
    } as T;
  } catch {
    return fallbackItem ?? null;
  }
}

export async function createFirestoreDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
  id?: string,
) {
  if (!isFirebaseAdminConfigured()) {
    return {
      id: id ?? 'demo-not-persisted',
      ...stripUndefinedValues(data),
    };
  }

  const cleanData = stripUndefinedValues(data);

  if (id) {
    await getFirebaseAdminDb().collection(collectionName).doc(id).set(cleanData);

    return {
      id,
      ...cleanData,
    };
  }

  const document = await getFirebaseAdminDb().collection(collectionName).add(cleanData);

  return {
    id: document.id,
    ...cleanData,
  };
}

export async function updateFirestoreDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: T,
) {
  if (!isFirebaseAdminConfigured()) {
    return {
      id,
      ...stripUndefinedValues(data),
    };
  }

  const cleanData = stripUndefinedValues(data);

  await getFirebaseAdminDb().collection(collectionName).doc(id).set(cleanData, { merge: true });

  return {
    id,
    ...cleanData,
  };
}

export async function deleteFirestoreDocument(collectionName: string, id: string) {
  if (isFirebaseAdminConfigured()) {
    await getFirebaseAdminDb().collection(collectionName).doc(id).delete();
  }

  return { id };
}
