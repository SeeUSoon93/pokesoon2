import { BiomeRegion } from '@/types/biome';

export function mapBiomeLabel(region: BiomeRegion) {
  return `${region.name} (${region.biomeType})`;
}
