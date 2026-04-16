import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const shouldForce = process.argv.includes('--force');

function parseEnvFile(filePath) {
  const values = {};
  const raw = readFileSync(filePath, 'utf8');

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value.replace(/\\n/g, '\n');
  }

  return values;
}

function loadEnv() {
  for (const candidate of ['.env.local', '.env']) {
    const filePath = path.join(projectRoot, candidate);
    if (!existsSync(filePath)) continue;

    const values = parseEnvFile(filePath);
    for (const [key, value] of Object.entries(values)) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  throw new Error('Firebase Admin credentials are missing. Check .env.local.');
}

function getSeedUserUid() {
  const adminUids = (process.env.NEXT_PUBLIC_ADMIN_UIDS ?? process.env.ADMIN_UIDS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return process.env.SEED_REPORT_USER_UID ?? adminUids[0] ?? 'seed-user';
}

loadEnv();

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert(getServiceAccount()),
  });

const db = getFirestore(app);
const seedUserUid = getSeedUserUid();
const now = new Date().toISOString();

const users = [
  {
    id: seedUserUid,
    data: {
      uid: seedUserUid,
      email: process.env.SEED_REPORT_USER_EMAIL ?? 'seed@example.com',
      name: process.env.SEED_REPORT_USER_NAME ?? 'Seed User',
      image: null,
      provider: 'seed',
      isAdmin: true,
      createdAt: now,
      updatedAt: now,
    },
  },
];

const events = [
  {
    id: 'event-community-day',
    data: {
      title: '커뮤니티 데이',
      slug: 'community-day',
      description: '이번 주말 14시부터 17시까지 대량 발생과 보너스가 열립니다.',
      startAt: '2026-04-18T14:00:00+09:00',
      endAt: '2026-04-18T17:00:00+09:00',
      tags: ['대량발생', 'XP 보너스'],
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'event-raid-hour',
    data: {
      title: '레이드 아워',
      slug: 'raid-hour',
      description: '수요일 저녁 전설 레이드 동선을 미리 확인하세요.',
      startAt: '2026-04-22T18:00:00+09:00',
      endAt: '2026-04-22T19:00:00+09:00',
      tags: ['레이드', '저녁'],
      createdAt: now,
      updatedAt: now,
    },
  },
];

const biomeRegions = [
  {
    id: 'biome-hangang',
    data: {
      name: '한강공원',
      center: { lat: 37.528, lng: 126.932 },
      biomeType: 'river',
      predictedPokemon: ['물짱이', '잉어킹', '고라파덕'],
      confidence: 0.78,
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'biome-olympic',
    data: {
      name: '올림픽공원',
      center: { lat: 37.521, lng: 127.122 },
      biomeType: 'park',
      predictedPokemon: ['이상해씨', '콩둘기', '도토링'],
      confidence: 0.66,
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'biome-downtown',
    data: {
      name: '강남역 일대',
      center: { lat: 37.498, lng: 127.027 },
      biomeType: 'urban',
      predictedPokemon: ['찌르꼬', '꼬렛', '코일'],
      confidence: 0.59,
      createdAt: now,
      updatedAt: now,
    },
  },
];

const biomeReports = [
  {
    id: 'report-hangang-1',
    data: {
      regionId: 'biome-hangang',
      userUid: seedUserUid,
      observedPokemon: ['잉어킹', '고라파덕'],
      note: '강변 쪽 스폰이 훨씬 촘촘했습니다.',
      rating: 4,
      visitedAt: '2026-04-15T19:30:00+09:00',
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'report-olympic-1',
    data: {
      regionId: 'biome-olympic',
      userUid: seedUserUid,
      observedPokemon: ['이상해씨', '도토링'],
      note: '산책로 기준으로 풀 타입이 자주 보였습니다.',
      rating: 5,
      visitedAt: '2026-04-14T16:10:00+09:00',
      createdAt: now,
      updatedAt: now,
    },
  },
];

async function upsertDocuments(collectionName, documents) {
  for (const document of documents) {
    const ref = db.collection(collectionName).doc(document.id);
    const snapshot = await ref.get();

    if (snapshot.exists && !shouldForce) {
      console.log(`[skip] ${collectionName}/${document.id}`);
      continue;
    }

    await ref.set(document.data, { merge: true });
    console.log(`[write] ${collectionName}/${document.id}`);
  }
}

async function main() {
  await upsertDocuments('users', users);
  await upsertDocuments('events', events);
  await upsertDocuments('biome_regions', biomeRegions);
  await upsertDocuments('biome_reports', biomeReports);

  console.log(`seed complete${shouldForce ? ' (force mode)' : ''}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
