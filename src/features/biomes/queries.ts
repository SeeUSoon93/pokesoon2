import { BiomeRegion } from '@/types/biome';
import { demoBiomes } from '@/lib/demo-data';
import { FIRESTORE_COLLECTIONS, readFirestoreCollection, readFirestoreDocument } from '@/lib/firestore';

export async function getBiomes(): Promise<BiomeRegion[]> {
  return readFirestoreCollection<BiomeRegion>(FIRESTORE_COLLECTIONS.biomeRegions, demoBiomes);
}

export async function getBiome(id: string): Promise<BiomeRegion | null> {
  const fallback = demoBiomes.find((biome) => biome.id === id);

  return readFirestoreDocument<BiomeRegion>(FIRESTORE_COLLECTIONS.biomeRegions, id, fallback);
}
