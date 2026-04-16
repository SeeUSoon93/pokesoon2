import { verifyFirebaseToken } from '@/lib/auth';
import { isAdminUid } from '@/lib/admin';

export async function getRequestUser(request: Request) {
  const idToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  return verifyFirebaseToken(idToken);
}

export async function requireAdmin(request: Request) {
  const user = await getRequestUser(request);

  return isAdminUid(user?.uid) ? user : null;
}
