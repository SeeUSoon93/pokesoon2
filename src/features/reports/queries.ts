import { BiomeReport } from '@/types/report';

export async function getReports(): Promise<BiomeReport[]> {
  return [
    {
      _id: 'report-1',
      regionId: 'biome-1',
      userId: 'user-1',
      observedPokemon: ['피카츄'],
      note: '후기 placeholder',
      rating: 4,
      visitedAt: new Date().toISOString(),
    },
  ];
}
