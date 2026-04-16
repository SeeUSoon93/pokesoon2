import { getFirebaseAdminAuth } from './firebase/admin';

export async function verifyFirebaseToken(idToken?: string) {
  if (!idToken) return null;

  try {
    return await getFirebaseAdminAuth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}
