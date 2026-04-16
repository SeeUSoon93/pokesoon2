'use client';

import { BiomeRegion } from '@/types/biome';
import { ui } from '@/lib/ui';
import { cn } from '@/lib/utils';

type BiomeMapProps = {
  biomes: BiomeRegion[];
  selectedBiomeId?: string;
  onSelectBiome: (id: string) => void;
};

export function BiomeMap({ biomes, onSelectBiome, selectedBiomeId }: BiomeMapProps) {
  return (
    <div className="card-stack">
      <div className="map-preview" aria-label="바이옴 지도 프리뷰">
        <span className="map-preview__route" />
        {biomes.map((biome, index) => (
          <button
            key={biome.id}
            type="button"
            className={cn('map-preview__pin', selectedBiomeId === biome.id && 'map-preview__pin--active')}
            style={{
              left: `${18 + index * 26}%`,
              top: `${30 + (index % 2) * 18}%`,
            }}
            onClick={() => onSelectBiome(biome.id)}
          />
        ))}
      </div>
      <div className="inline-row">
        {biomes.map((biome) => (
          <button
            key={biome.id}
            type="button"
            className={selectedBiomeId === biome.id ? ui.badgeWarm : ui.badge}
            onClick={() => onSelectBiome(biome.id)}
          >
            {biome.name}
          </button>
        ))}
      </div>
    </div>
  );
}
