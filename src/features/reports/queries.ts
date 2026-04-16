import { BiomeReport } from '@/types/report';
import { demoReports } from '@/lib/demo-data';
import { FIRESTORE_COLLECTIONS, readFirestoreCollection, readFirestoreDocument } from '@/lib/firestore';

type ReportFilters = {
  regionId?: string;
  userUid?: string;
};

export async function getReports(filters: ReportFilters = {}): Promise<BiomeReport[]> {
  const items = await readFirestoreCollection<BiomeReport>(FIRESTORE_COLLECTIONS.biomeReports, demoReports);

  return items
    .filter((report) => (filters.regionId ? report.regionId === filters.regionId : true))
    .filter((report) => (filters.userUid ? report.userUid === filters.userUid : true))
    .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
}

export async function getReport(id: string): Promise<BiomeReport | null> {
  const fallback = demoReports.find((report) => report.id === id);

  return readFirestoreDocument<BiomeReport>(FIRESTORE_COLLECTIONS.biomeReports, id, fallback);
}
