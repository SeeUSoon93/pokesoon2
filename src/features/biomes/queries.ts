import { BiomeRegion } from '@/types/biome';

export async function getBiomes(): Promise<BiomeRegion[]> {
  return [
    {
      _id: 'biome-1',
      name: '한강공원',
      biomeType: 'river',
      predictedPokemon: ['물짱이'],
      confidence: 0.7,
    },
  ];
}
