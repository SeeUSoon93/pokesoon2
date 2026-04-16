'use client';

import { AdminActions } from '@/components/common/admin-actions';
import { BiomeRegion } from '@/types/biome';
import { ui } from '@/lib/ui';

type BiomeRegionCardProps = {
  biomes: BiomeRegion[];
  selectedBiomeId?: string;
  onSelectBiome: (id: string) => void;
};

export function BiomeRegionCard({ biomes, onSelectBiome, selectedBiomeId }: BiomeRegionCardProps) {
  return (
    <div className="card-stack">
      <AdminActions
        collectionLabel="바이옴"
        endpoint="/api/biomes"
        canUpdate={false}
        canDelete={false}
        createTemplate={{
          id: 'biome-id',
          name: '지역 이름',
          biomeType: 'park',
          center: { lat: 37.5, lng: 127 },
          predictedPokemon: ['피카츄'],
          confidence: 0.7,
        }}
      />
      {biomes.map((biome) => (
        <article key={biome.id} className={selectedBiomeId === biome.id ? `${ui.stat} biome-item--selected` : ui.stat}>
          <button type="button" className="biome-item__select" onClick={() => onSelectBiome(biome.id)}>
            <div className="inline-row">
              <strong>{biome.name}</strong>
              <span className={ui.badgeWarm}>{Math.round(biome.confidence * 100)}%</span>
            </div>
            <p className="muted-copy">{biome.predictedPokemon.join(', ')}</p>
          </button>
          <AdminActions
            collectionLabel="바이옴"
            endpoint="/api/biomes"
            itemId={biome.id}
            canCreate={false}
            updateTemplate={{
              name: biome.name,
              biomeType: biome.biomeType,
              center: biome.center,
              predictedPokemon: biome.predictedPokemon,
              confidence: biome.confidence,
            }}
          />
        </article>
      ))}
    </div>
  );
}
