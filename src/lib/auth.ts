import { firebaseAdminAuth } from './firebase/admin';

export async function verifyFirebaseToken(idToken?: string) {
  if (!idToken) return null;

  try {
    return await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return null;
  }
}
