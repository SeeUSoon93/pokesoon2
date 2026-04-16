import { readFileSync } from 'fs';
import path from 'path';
import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let cachedServiceAccount: ServiceAccount | null | undefined;

type FirebaseServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

function normalizeServiceAccount(value: FirebaseServiceAccountJson): ServiceAccount | null {
  const projectId = value.projectId ?? value.project_id;
  const clientEmail = value.clientEmail ?? value.client_email;
  const privateKey = value.privateKey ?? value.private_key;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getServiceAccount(): ServiceAccount | null {
  if (cachedServiceAccount !== undefined) {
    return cachedServiceAccount;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8')) as FirebaseServiceAccountJson;
      cachedServiceAccount = normalizeServiceAccount(serviceAccount);
    } catch {
      cachedServiceAccount = null;
    }

    return cachedServiceAccount;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as FirebaseServiceAccountJson;
      cachedServiceAccount = normalizeServiceAccount(serviceAccount);
    } catch {
      cachedServiceAccount = null;
    }

    return cachedServiceAccount;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  cachedServiceAccount =
    projectId && clientEmail && privateKey
      ? {
          projectId,
          clientEmail,
          privateKey,
        }
      : null;

  return cachedServiceAccount;
}

export function isFirebaseAdminConfigured() {
  return Boolean(getServiceAccount());
}

export function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error('Firebase Admin credentials are not configured.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
